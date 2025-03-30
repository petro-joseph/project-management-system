import nodemailer from 'nodemailer';
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';

export class NotificationService {
  private transporter: nodemailer.Transporter;
  private userRepository = AppDataSource.getRepository(User);

  /**
   * Initializes the email transporter with the specified SMTP configuration.
   * Verifies the email connection on initialization.
   */
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mailhog',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: false,
      ignoreTLS: true, // Required for MailHog
      auth: null // Disable authentication for MailHog
    } as nodemailer.TransportOptions);

    // Verify transporter on initialization
    this.verifyConnection();
  }

  /**
   * Verify email connection
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('Email service is ready');
    } catch (error) {
      console.error('Email service verification failed:', error);
    }
  }

  /**
   * Send task assignment notification
   */
  async sendTaskAssignmentNotification(task: Task, assignee: User): Promise<void> {
    try {
      const project = await AppDataSource.getRepository(Project).findOne({
        where: { id: task.projectId },
      });

      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@projectmanagement.com',
        to: assignee.email,
        subject: `New Task Assignment: ${task.name}`,
        html: `
          <h2>You have been assigned a new task</h2>
          <p><strong>Task:</strong> ${task.name}</p>
          <p><strong>Project:</strong> ${project?.name || 'N/A'}</p>
          <p><strong>Description:</strong> ${task.description}</p>
          <p><strong>Status:</strong> ${task.status}</p>
          <p>Please log in to the system to view more details.</p>
        `,
      };

      await this.transporter.sendMail(emailContent);
      console.log(`Task assignment notification sent to ${assignee.email}`);
    } catch (error) {
      console.error('Failed to send task assignment notification:', error);
    }
  }

  /**
   * Send task status update notification
   */
  async sendTaskStatusUpdateNotification(task: Task, previousStatus: string): Promise<void> {
    try {
      const project = await AppDataSource.getRepository(Project).findOne({
        where: { id: task.projectId },
        relations: ['manager'],
      });

      if (!project?.manager) {
        console.log('No project manager found for status update notification');
        return;
      }

      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@projectmanagement.com',
        to: project.manager.email,
        subject: `Task Status Update: ${task.name}`,
        html: `
          <h2>Task Status Update</h2>
          <p><strong>Task:</strong> ${task.name}</p>
          <p><strong>Project:</strong> ${project.name}</p>
          <p><strong>Status changed from:</strong> ${previousStatus}</p>
          <p><strong>New Status:</strong> ${task.status}</p>
        `,
      };

      await this.transporter.sendMail(emailContent);
      console.log(`Status update notification sent to ${project.manager.email}`);
    } catch (error) {
      console.error('Failed to send status update notification:', error);
    }
  }

  /**
   * Send project completion notification
   */
  async sendProjectCompletionNotification(project: Project): Promise<void> {
    try {
      const stakeholders = await this.userRepository.find({
        where: [
          { id: project.managerId },
        ],
      });

      if (stakeholders.length === 0) {
        console.log('No stakeholders found for project completion notification');
        return;
      }

      const emailPromises = stakeholders.map(async (stakeholder) => {
        try {
          const emailContent = {
            from: process.env.SMTP_FROM || 'noreply@projectmanagement.com',
            to: stakeholder.email,
            subject: `Project Completed: ${project.name}`,
            html: `
              <h2>Project Completion Notification</h2>
              <p><strong>Project:</strong> ${project.name}</p>
              <p><strong>Description:</strong> ${project.description}</p>
              <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
            `,
          };

          await this.transporter.sendMail(emailContent);
          console.log(`Project completion notification sent to ${stakeholder.email}`);
        } catch (error) {
          console.error(`Failed to send notification to ${stakeholder.email}:`, error);
        }
      });

      await Promise.all(emailPromises);
    } catch (error) {
      console.error('Failed to send project completion notifications:', error);
    }
  }


}

export const notificationService = new NotificationService();