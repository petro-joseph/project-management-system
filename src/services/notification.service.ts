import nodemailer from 'nodemailer';
import { Task } from '../entities/task.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { AppDataSource } from '../config/data-source';

export class NotificationService {
  private transporter: nodemailer.Transporter;
  private userRepository = AppDataSource.getRepository(User);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send task assignment notification
   */
  async sendTaskAssignmentNotification(task: Task, assignee: User) {
    const project = await AppDataSource.getRepository(Project).findOne({
      where: { id: task.projectId },
    });

    const emailContent = {
      from: process.env.SMTP_FROM,
      to: assignee.email,
      subject: `New Task Assignment: ${task.name}`,
      html: `
        <h2>You have been assigned a new task</h2>
        <p><strong>Task:</strong> ${task.name}</p>
        <p><strong>Project:</strong> ${project?.name}</p>
        <p><strong>Description:</strong> ${task.description}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p>Please log in to the system to view more details.</p>
      `,
    };

    await this.transporter.sendMail(emailContent);
  }

  /**
   * Send task status update notification
   */
  async sendTaskStatusUpdateNotification(task: Task, previousStatus: string) {
    const project = await AppDataSource.getRepository(Project).findOne({
      where: { id: task.projectId },
      relations: ['manager'],
    });

    if (!project?.manager) return;

    const emailContent = {
      from: process.env.SMTP_FROM,
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
  }

  /**
   * Send project completion notification
   */
  async sendProjectCompletionNotification(project: Project) {
    const stakeholders = await this.userRepository.find({
      where: [
        { id: project.managerId },
        // Add other stakeholders as needed
      ],
    });

    const emailPromises = stakeholders.map((stakeholder) => {
      const emailContent = {
        from: process.env.SMTP_FROM,
        to: stakeholder.email,
        subject: `Project Completed: ${project.name}`,
        html: `
          <h2>Project Completion Notification</h2>
          <p><strong>Project:</strong> ${project.name}</p>
          <p><strong>Description:</strong> ${project.description}</p>
          <p><strong>Completion Date:</strong> ${new Date().toLocaleDateString()}</p>
        `,
      };

      return this.transporter.sendMail(emailContent);
    });

    await Promise.all(emailPromises);
  }
}