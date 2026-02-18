import api from '@/lib/api';

/**
 * Get event agenda/schedule
 */
export const getEventAgenda = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/agenda`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching event agenda:', error);
    return [];
  }
};

/**
 * Get event speakers
 */
export const getEventSpeakers = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/speakers`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching event speakers:', error);
    return [];
  }
};

/**
 * Create agenda item
 */
export const createAgendaItem = async (eventId, agendaData) => {
  try {
    const response = await api.post(`/events/${eventId}/agenda`, agendaData);
    return response.data;
  } catch (error) {
    console.error('Error creating agenda item:', error);
    throw error;
  }
};

/**
 * Update agenda item
 */
export const updateAgendaItem = async (eventId, agendaId, agendaData) => {
  try {
    const response = await api.put(`/events/${eventId}/agenda/${agendaId}`, agendaData);
    return response.data;
  } catch (error) {
    console.error('Error updating agenda item:', error);
    throw error;
  }
};

/**
 * Delete agenda item
 */
export const deleteAgendaItem = async (eventId, agendaId) => {
  try {
    const response = await api.delete(`/events/${eventId}/agenda/${agendaId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting agenda item:', error);
    throw error;
  }
};

/**
 * Add speaker to event
 */
export const addEventSpeaker = async (eventId, speakerData) => {
  try {
    const response = await api.post(`/events/${eventId}/speakers`, speakerData);
    return response.data;
  } catch (error) {
    console.error('Error adding speaker:', error);
    throw error;
  }
};

/**
 * Update speaker
 */
export const updateEventSpeaker = async (eventId, speakerId, speakerData) => {
  try {
    const response = await api.put(`/events/${eventId}/speakers/${speakerId}`, speakerData);
    return response.data;
  } catch (error) {
    console.error('Error updating speaker:', error);
    throw error;
  }
};

/**
 * Remove speaker from event
 */
export const removeEventSpeaker = async (eventId, speakerId) => {
  try {
    const response = await api.delete(`/events/${eventId}/speakers/${speakerId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing speaker:', error);
    throw error;
  }
};

/**
 * Generate agenda PDF
 */
export const generateAgendaPDF = async (eventId, eventData) => {
  try {
    // Check if jsPDF is available, fallback to creating text document
    if (typeof window !== 'undefined' && window.jsPDF) {
      const { jsPDF } = window.jsPDF;
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text(eventData.title || 'Event Agenda', 20, 20);
      
      // Event details
      doc.setFontSize(10);
      doc.setTextColor(100);
      let yPos = 35;
      
      if (eventData.date) {
        doc.text(`Date: ${new Date(eventData.date).toLocaleDateString()}`, 20, yPos);
        yPos += 8;
      }
      
      if (eventData.location) {
        doc.text(`Location: ${eventData.location}`, 20, yPos);
        yPos += 8;
      }
      
      if (eventData.description) {
        const descLines = doc.splitTextToSize(eventData.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 8;
      }
      
      // Agenda
      doc.setTextColor(0);
      doc.setFontSize(14);
      doc.text('Schedule', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      if (eventData.agenda && eventData.agenda.length > 0) {
        eventData.agenda.forEach((item) => {
          // Time
          doc.setFont(undefined, 'bold');
          doc.text(`${item.time || item.startTime}`, 20, yPos);
          yPos += 6;
          
          // Activity
          doc.setFont(undefined, 'normal');
          const titleLines = doc.splitTextToSize(item.activity || item.title, 170);
          doc.text(titleLines, 25, yPos);
          yPos += titleLines.length * 4;
          
          // Description
          if (item.description || item.content) {
            doc.setTextColor(100);
            const descLines = doc.splitTextToSize(item.description || item.content, 165);
            doc.text(descLines, 25, yPos);
            yPos += descLines.length * 4;
            doc.setTextColor(0);
          }
          
          // Location
          if (item.location || item.venue) {
            doc.setFont(undefined, 'italic');
            doc.setTextColor(150);
            doc.text(`📍 ${item.location || item.venue}`, 25, yPos);
            yPos += 6;
            doc.setTextColor(0);
            doc.setFont(undefined, 'normal');
          }
          
          yPos += 4;
          
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      // Speakers
      if (eventData.speakers && eventData.speakers.length > 0) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.setFontSize(14);
        doc.text('Speakers', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        eventData.speakers.forEach((speaker) => {
          // Speaker name
          doc.setFont(undefined, 'bold');
          doc.text(speaker.name || speaker.fullName, 20, yPos);
          yPos += 6;
          
          // Title/Role
          if (speaker.title || speaker.role) {
            doc.setFont(undefined, 'normal');
            doc.setTextColor(100);
            doc.text(speaker.title || speaker.role, 25, yPos);
            yPos += 6;
            doc.setTextColor(0);
          }
          
          // Bio
          if (speaker.bio || speaker.biography) {
            const bioLines = doc.splitTextToSize(speaker.bio || speaker.biography, 165);
            doc.text(bioLines, 25, yPos);
            yPos += bioLines.length * 4;
          }
          
          yPos += 4;
          
          // Check if we need a new page
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      }
      
      // Save PDF
      const fileName = `${eventData.title || 'Event'}-Agenda.pdf`;
      doc.save(fileName);
    } else {
      // Fallback: Create a text file if PDF library not available
      let content = `${eventData.title || 'Event Agenda'}\n`;
      content += '='.repeat(50) + '\n\n';
      
      if (eventData.date) {
        content += `Date: ${new Date(eventData.date).toLocaleDateString()}\n`;
      }
      if (eventData.location) {
        content += `Location: ${eventData.location}\n`;
      }
      if (eventData.description) {
        content += `\nDescription:\n${eventData.description}\n`;
      }
      
      content += '\nSchedule:\n';
      content += '-'.repeat(50) + '\n';
      
      if (eventData.agenda && eventData.agenda.length > 0) {
        eventData.agenda.forEach((item) => {
          content += `\n${item.time || item.startTime}\n`;
          content += `${item.activity || item.title}\n`;
          if (item.description || item.content) {
            content += `${item.description || item.content}\n`;
          }
          if (item.location || item.venue) {
            content += `📍 ${item.location || item.venue}\n`;
          }
        });
      }
      
      if (eventData.speakers && eventData.speakers.length > 0) {
        content += '\n' + '-'.repeat(50) + '\n';
        content += 'Speakers:\n';
        content += '-'.repeat(50) + '\n';
        
        eventData.speakers.forEach((speaker) => {
          content += `\n${speaker.name || speaker.fullName}\n`;
          if (speaker.title || speaker.role) {
            content += `${speaker.title || speaker.role}\n`;
          }
          if (speaker.bio || speaker.biography) {
            content += `${speaker.bio || speaker.biography}\n`;
          }
        });
      }
      
      // Create and download text file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventData.title || 'Event'}-Agenda.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Get agenda session details
 */
export const getSessionDetails = async (eventId, sessionId) => {
  try {
    const response = await api.get(`/events/${eventId}/agenda/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details:', error);
    return null;
  }
};

/**
 * Get speaker details
 */
export const getSpeakerDetails = async (eventId, speakerId) => {
  try {
    const response = await api.get(`/events/${eventId}/speakers/${speakerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching speaker details:', error);
    return null;
  }
};

/**
 * Reorder agenda items
 */
export const reorderAgendaItems = async (eventId, agendaOrder) => {
  try {
    const response = await api.put(`/events/${eventId}/agenda/reorder`, {
      order: agendaOrder
    });
    return response.data;
  } catch (error) {
    console.error('Error reordering agenda:', error);
    throw error;
  }
};
