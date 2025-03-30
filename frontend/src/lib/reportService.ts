import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ExportOptions } from '@/components/reports/ExportReportDialog';
import { formatDate } from './utils';

// Define a type for jsPDF with the autotable plugin
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Helper function to add text with word wrapping
const addWrappedText = (
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number => {
  const textLines = doc.splitTextToSize(text, maxWidth);
  doc.text(textLines, x, y);
  return y + textLines.length * lineHeight;
};

// Function to add header to the PDF
const addHeader = (doc: jsPDF, options: ExportOptions): number => {
  let yPos = 20;
  
  // Add logo if requested
  if (options.includeLogo) {
    // In a real app, you would use an actual logo
    // This is a placeholder for the logo drawing
    doc.setFillColor(100, 100, 240);
    doc.rect(20, yPos - 10, 40, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('ProjectFlow', 25, yPos - 1);
    doc.setTextColor(0, 0, 0);
    yPos += 20;
  }
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(options.title, 20, yPos);
  yPos += 10;
  
  // Add date range if applicable
  if (options.startDate && options.endDate) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const dateText = `Date Range: ${formatDate(options.startDate.toISOString())} - ${formatDate(options.endDate.toISOString())}`;
    doc.text(dateText, 20, yPos);
    yPos += 10;
  }
  
  // Add separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  return yPos;
};

// Function to add footer to each page
const addFooter = (doc: jsPDF): void => {
  // Use internal.pages.length instead of getNumberOfPages
  const pageCount = doc.internal.pages.length - 1;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add page number
    const pageSize = doc.internal.pageSize;
    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
    
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 10);
    
    // Add generation timestamp
    doc.text(`Generated on ${formatDate(new Date().toISOString())}`, 20, pageHeight - 10);
  }
};

// Main function to generate a PDF report from task data
export const generateTaskReport = async (
  taskData: any[],
  options: ExportOptions
): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header
  let yPos = addHeader(doc, options);
  
  // Add overview section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Tasks Overview', 20, yPos);
  yPos += 10;
  
  // Add summary statistics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const completed = taskData.filter(t => t.status === 'completed').length;
  const inProgress = taskData.filter(t => t.status === 'in-progress').length;
  const pending = taskData.filter(t => t.status === 'pending').length;
  const cancelled = taskData.filter(t => t.status === 'cancelled').length;
  
  doc.text(`Total Tasks: ${taskData.length}`, 20, yPos);
  yPos += 7;
  doc.text(`Completed: ${completed}`, 20, yPos);
  yPos += 7;
  doc.text(`In Progress: ${inProgress}`, 20, yPos);
  yPos += 7;
  doc.text(`Pending: ${pending}`, 20, yPos);
  yPos += 7;
  doc.text(`Cancelled: ${cancelled}`, 20, yPos);
  yPos += 15;
  
  // Add task table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Task Details', 20, yPos);
  yPos += 10;
  
  // Format data for the table
  const tableData = taskData.map(task => [
    task.title,
    task.status.charAt(0).toUpperCase() + task.status.slice(1),
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
    formatDate(task.dueDate),
    task.userName || 'Unassigned'
  ]);
  
  // Generate the table
  doc.autoTable({
    startY: yPos,
    head: [['Task Title', 'Status', 'Priority', 'Due Date', 'Assigned To']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [70, 130, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    styles: { overflow: 'linebreak', cellPadding: 3 }
  });
  
  // Add footer
  addFooter(doc);
  
  // Save the PDF
  doc.save(`${options.fileName}.pdf`);
};

// Generate project report
export const generateProjectReport = async (
  projectData: any[],
  options: ExportOptions
): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header
  let yPos = addHeader(doc, options);
  
  // Add overview section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Projects Overview', 20, yPos);
  yPos += 10;
  
  // Add summary statistics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const completed = projectData.filter(p => p.status === 'completed').length;
  const inProgress = projectData.filter(p => p.status === 'in-progress').length;
  const planned = projectData.filter(p => p.status === 'planned').length;
  const onHold = projectData.filter(p => p.status === 'on-hold').length;
  
  doc.text(`Total Projects: ${projectData.length}`, 20, yPos);
  yPos += 7;
  doc.text(`Completed: ${completed}`, 20, yPos);
  yPos += 7;
  doc.text(`In Progress: ${inProgress}`, 20, yPos);
  yPos += 7;
  doc.text(`Planned: ${planned}`, 20, yPos);
  yPos += 7;
  doc.text(`On Hold: ${onHold}`, 20, yPos);
  yPos += 15;
  
  // Add project table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Details', 20, yPos);
  yPos += 10;
  
  // Format data for the table
  const tableData = projectData.map(project => [
    project.name,
    project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' '),
    `${project.tasksCompleted}/${project.tasksTotal}`,
    formatDate(project.dueDate),
    `${Math.round((project.tasksCompleted / (project.tasksTotal || 1)) * 100)}%`
  ]);
  
  // Generate the table
  doc.autoTable({
    startY: yPos,
    head: [['Project Name', 'Status', 'Tasks', 'Due Date', 'Completion']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [70, 130, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    styles: { overflow: 'linebreak', cellPadding: 3 }
  });
  
  // Add footer
  addFooter(doc);
  
  // Save the PDF
  doc.save(`${options.fileName}.pdf`);
};

// Generate user activity report
export const generateUserReport = async (
  userData: any[],
  options: ExportOptions
): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header
  let yPos = addHeader(doc, options);
  
  // Add overview section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('User Activity Overview', 20, yPos);
  yPos += 10;
  
  // Add summary statistics
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const admins = userData.filter(u => u.role === 'admin').length;
  const managers = userData.filter(u => u.role === 'manager').length;
  const regularUsers = userData.filter(u => u.role === 'user').length;
  
  doc.text(`Total Users: ${userData.length}`, 20, yPos);
  yPos += 7;
  doc.text(`Admins: ${admins}`, 20, yPos);
  yPos += 7;
  doc.text(`Managers: ${managers}`, 20, yPos);
  yPos += 7;
  doc.text(`Regular Users: ${regularUsers}`, 20, yPos);
  yPos += 15;
  
  // Add user table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('User Details', 20, yPos);
  yPos += 10;
  
  // Format data for the table
  const tableData = userData.map(user => [
    user.name,
    user.email,
    user.role.charAt(0).toUpperCase() + user.role.slice(1),
    formatDate(user.createdAt),
    user.taskCount || 0,
    user.projectCount || 0
  ]);
  
  // Generate the table
  doc.autoTable({
    startY: yPos,
    head: [['Name', 'Email', 'Role', 'Join Date', 'Tasks', 'Projects']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [70, 130, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    styles: { overflow: 'linebreak', cellPadding: 3 }
  });
  
  // Add footer
  addFooter(doc);
  
  // Save the PDF
  doc.save(`${options.fileName}.pdf`);
};

// Function to capture a chart as an image and add it to the PDF
export const addChartToPdf = async (
  chartElement: HTMLElement,
  title: string,
  doc: jsPDF,
  yPosition: number
): Promise<number> => {
  // First add the title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 20, yPosition);
  yPosition += 10;
  
  try {
    // Convert the chart to a canvas
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true
    });
    
    // Adjust canvas to fit in PDF
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 170;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add the image to the PDF
    doc.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
    
    // Return the updated Y position
    return yPosition + imgHeight + 15;
  } catch (error) {
    console.error('Error capturing chart:', error);
    return yPosition + 5;
  }
};

// Main function to create a comprehensive report with charts
export const generateComprehensiveReport = async (
  data: {
    tasks: any[],
    projects: any[],
    users: any[]
  },
  charts: {
    taskCompletion?: HTMLElement,
    projectProgress?: HTMLElement,
    userActivity?: HTMLElement
  },
  options: ExportOptions
): Promise<void> => {
  const doc = new jsPDF();
  
  // Add header
  let yPos = addHeader(doc, options);
  
  // Add executive summary
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const summaryText = `This report provides an overview of project activities during the period from ${
    formatDate(options.startDate?.toISOString() || new Date().toISOString())
  } to ${
    formatDate(options.endDate?.toISOString() || new Date().toISOString())
  }. It includes task status distribution, project progress, and user activity metrics.`;
  
  yPos = addWrappedText(doc, summaryText, 20, yPos, 170, 6);
  yPos += 15;
  
  // Add key statistics
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Statistics', 20, yPos);
  yPos += 10;
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = data.tasks.length;
  const completedProjects = data.projects.filter(p => p.status === 'completed').length;
  const totalProjects = data.projects.length;
  
  const stats = [
    `Total Tasks: ${totalTasks}`,
    `Completed Tasks: ${completedTasks} (${Math.round((completedTasks / (totalTasks || 1)) * 100)}%)`,
    `Total Projects: ${totalProjects}`,
    `Completed Projects: ${completedProjects} (${Math.round((completedProjects / (totalProjects || 1)) * 100)}%)`,
    `Active Users: ${data.users.length}`
  ];
  
  stats.forEach(stat => {
    doc.text(`• ${stat}`, 25, yPos);
    yPos += 7;
  });
  
  yPos += 10;
  
  // Add charts if available
  if (charts.taskCompletion) {
    yPos = await addChartToPdf(charts.taskCompletion, 'Task Status Distribution', doc, yPos);
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
  }
  
  if (charts.projectProgress) {
    yPos = await addChartToPdf(charts.projectProgress, 'Project Progress', doc, yPos);
    
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
  }
  
  if (charts.userActivity) {
    yPos = await addChartToPdf(charts.userActivity, 'User Activity', doc, yPos);
  }
  
  // Add tables on a new page
  doc.addPage();
  yPos = 20;
  
  // Add task table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Task Details', 20, yPos);
  yPos += 10;
  
  // Format task data for the table
  const taskTableData = data.tasks.slice(0, 10).map(task => [
    task.title.substring(0, 30) + (task.title.length > 30 ? '...' : ''),
    task.status.charAt(0).toUpperCase() + task.status.slice(1),
    task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
    formatDate(task.dueDate),
    task.userName || 'Unassigned'
  ]);
  
  // Generate the task table
  doc.autoTable({
    startY: yPos,
    head: [['Task Title', 'Status', 'Priority', 'Due Date', 'Assigned To']],
    body: taskTableData,
    theme: 'grid',
    headStyles: { fillColor: [70, 130, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    styles: { overflow: 'linebreak', cellPadding: 3 }
  });
  
  // Get the final Y position after the table
  yPos = (doc as any).lastAutoTable.finalY + 15;
  
  // Check if we need a new page for the project table
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  
  // Add project table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Project Details', 20, yPos);
  yPos += 10;
  
  // Format project data for the table
  const projectTableData = data.projects.slice(0, 10).map(project => [
    project.name.substring(0, 30) + (project.name.length > 30 ? '...' : ''),
    project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' '),
    `${project.tasksCompleted}/${project.tasksTotal}`,
    formatDate(project.dueDate),
    `${Math.round((project.tasksCompleted / (project.tasksTotal || 1)) * 100)}%`
  ]);
  
  // Generate the project table
  doc.autoTable({
    startY: yPos,
    head: [['Project Name', 'Status', 'Tasks', 'Due Date', 'Completion']],
    body: projectTableData,
    theme: 'grid',
    headStyles: { fillColor: [70, 130, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    styles: { overflow: 'linebreak', cellPadding: 3 }
  });
  
  // Add footer to all pages
  addFooter(doc);
  
  // Save the PDF
  doc.save(`${options.fileName}.pdf`);
};
