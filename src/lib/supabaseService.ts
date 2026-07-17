import { supabase, isConfigured } from './supabaseClient';

// Helper to convert DB snake_case object to client camelCase
function mapMemberToClient(dbMember: any) {
  if (!dbMember) return null;
  return {
    id: dbMember.id,
    name: dbMember.name,
    email: dbMember.email,
    phone: dbMember.phone,
    level: dbMember.level,
    status: dbMember.status,
    joinDate: dbMember.join_date || dbMember.joinDate,
  };
}

function mapMemberToDb(clientMember: any) {
  if (!clientMember) return null;
  return {
    name: clientMember.name,
    email: clientMember.email,
    phone: clientMember.phone,
    level: clientMember.level,
    status: clientMember.status,
    ...(clientMember.joinDate ? { join_date: clientMember.joinDate } : {}),
  };
}

function mapContentToClient(dbContent: any) {
  if (!dbContent) return null;
  return {
    id: dbContent.id,
    title: dbContent.title,
    type: dbContent.type,
    author: dbContent.author,
    views: dbContent.views,
    status: dbContent.status,
    publishedAt: dbContent.published_at || dbContent.publishedAt,
  };
}

function mapContentToDb(clientContent: any) {
  if (!clientContent) return null;
  return {
    title: clientContent.title,
    type: clientContent.type,
    author: clientContent.author,
    views: clientContent.views,
    status: clientContent.status,
    ...(clientContent.publishedAt ? { published_at: clientContent.publishedAt } : {}),
  };
}

function mapDonationToClient(dbDonation: any) {
  if (!dbDonation) return null;
  return {
    id: dbDonation.id,
    memberId: dbDonation.member_id || dbDonation.memberId,
    donorName: dbDonation.donor_name || dbDonation.donorName,
    amount: typeof dbDonation.amount === 'string' ? parseFloat(dbDonation.amount) : dbDonation.amount,
    type: dbDonation.type,
    status: dbDonation.status,
    date: dbDonation.date,
  };
}

function mapDonationToDb(clientDonation: any) {
  if (!clientDonation) return null;
  return {
    member_id: clientDonation.memberId,
    donor_name: clientDonation.donorName,
    amount: clientDonation.amount,
    type: clientDonation.type,
    status: clientDonation.status,
    ...(clientDonation.date ? { date: clientDonation.date } : {}),
  };
}

function mapConsultationToClient(dbConsult: any) {
  if (!dbConsult) return null;
  return {
    id: dbConsult.id,
    memberId: dbConsult.member_id || dbConsult.memberId,
    requesterName: dbConsult.requester_name || dbConsult.requesterName,
    type: dbConsult.type,
    status: dbConsult.status,
    manager: dbConsult.manager,
    requestedAt: dbConsult.requested_at || dbConsult.requestedAt,
  };
}

function mapConsultationToDb(clientConsult: any) {
  if (!clientConsult) return null;
  return {
    member_id: clientConsult.memberId,
    requester_name: clientConsult.requesterName,
    type: clientConsult.type,
    status: clientConsult.status,
    manager: clientConsult.manager,
    ...(clientConsult.requestedAt ? { requested_at: clientConsult.requestedAt } : {}),
  };
}

export const supabaseService = {
  isSupabaseConnected: () => isConfigured,

  // --- Members Service ---
  members: {
    async getAll(): Promise<any[]> {
      if (isConfigured) {
        try {
          const { data, error } = await supabase
            .from('members')
            .select('*')
            .order('join_date', { ascending: false });
          if (!error && data) {
            return data.map(mapMemberToClient);
          }
          console.warn('Supabase members fetch error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase members exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/members');
      if (!response.ok) throw new Error('Failed to fetch members via API');
      return response.json();
    },

    async create(member: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapMemberToDb(member);
          const { data, error } = await supabase
            .from('members')
            .insert([dbData])
            .select()
            .single();
          if (!error && data) {
            return mapMemberToClient(data);
          }
          console.warn('Supabase members create error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase members create exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      if (!response.ok) throw new Error('Failed to create member via API');
      return response.json();
    },

    async update(id: number, member: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapMemberToDb(member);
          const { data, error } = await supabase
            .from('members')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();
          if (!error && data) {
            return mapMemberToClient(data);
          }
          console.warn('Supabase members update error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase members update exception:', e);
        }
      }

      // Fallback
      const response = await fetch(`/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      if (!response.ok) throw new Error('Failed to update member via API');
      return response.json();
    },

    async delete(id: number): Promise<any> {
      if (isConfigured) {
        try {
          const { error } = await supabase
            .from('members')
            .delete()
            .eq('id', id);
          if (!error) {
            return { success: true };
          }
          console.warn('Supabase members delete error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase members delete exception:', e);
        }
      }

      // Fallback
      const response = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete member via API');
      return response.json();
    },
  },

  // --- Donations Service ---
  donations: {
    async getAll(): Promise<any[]> {
      if (isConfigured) {
        try {
          const { data, error } = await supabase
            .from('donations')
            .select('*')
            .order('date', { ascending: false });
          if (!error && data) {
            return data.map(mapDonationToClient);
          }
          console.warn('Supabase donations fetch error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase donations exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/donations');
      if (!response.ok) throw new Error('Failed to fetch donations via API');
      return response.json();
    },

    async create(donation: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapDonationToDb(donation);
          const { data, error } = await supabase
            .from('donations')
            .insert([dbData])
            .select()
            .single();
          if (!error && data) {
            return mapDonationToClient(data);
          }
          console.warn('Supabase donations create error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase donations create exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donation),
      });
      if (!response.ok) throw new Error('Failed to create donation via API');
      return response.json();
    },
  },

  // --- Contents Service ---
  contents: {
    async getAll(): Promise<any[]> {
      if (isConfigured) {
        try {
          const { data, error } = await supabase
            .from('contents')
            .select('*')
            .order('published_at', { ascending: false });
          if (!error && data) {
            return data.map(mapContentToClient);
          }
          console.warn('Supabase contents fetch error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase contents exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/contents');
      if (!response.ok) throw new Error('Failed to fetch contents via API');
      return response.json();
    },

    async create(content: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapContentToDb(content);
          const { data, error } = await supabase
            .from('contents')
            .insert([dbData])
            .select()
            .single();
          if (!error && data) {
            return mapContentToClient(data);
          }
          console.warn('Supabase contents create error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase contents create exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to create content via API');
      return response.json();
    },

    async update(id: number, content: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapContentToDb(content);
          const { data, error } = await supabase
            .from('contents')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();
          if (!error && data) {
            return mapContentToClient(data);
          }
          console.warn('Supabase contents update error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase contents update exception:', e);
        }
      }

      // Fallback
      const response = await fetch(`/api/contents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      if (!response.ok) throw new Error('Failed to update content via API');
      return response.json();
    },

    async delete(id: number): Promise<any> {
      if (isConfigured) {
        try {
          const { error } = await supabase
            .from('contents')
            .delete()
            .eq('id', id);
          if (!error) {
            return { success: true };
          }
          console.warn('Supabase contents delete error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase contents delete exception:', e);
        }
      }

      // Fallback
      const response = await fetch(`/api/contents/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete content via API');
      return response.json();
    },
  },

  // --- Consultations Service ---
  consultations: {
    async getAll(): Promise<any[]> {
      if (isConfigured) {
        try {
          const { data, error } = await supabase
            .from('consultations')
            .select('*')
            .order('requested_at', { ascending: false });
          if (!error && data) {
            return data.map(mapConsultationToClient);
          }
          console.warn('Supabase consultations fetch error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase consultations exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/consultations');
      if (!response.ok) throw new Error('Failed to fetch consultations via API');
      return response.json();
    },

    async create(consultation: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapConsultationToDb(consultation);
          const { data, error } = await supabase
            .from('consultations')
            .insert([dbData])
            .select()
            .single();
          if (!error && data) {
            return mapConsultationToClient(data);
          }
          console.warn('Supabase consultations create error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase consultations create exception:', e);
        }
      }

      // Fallback
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultation),
      });
      if (!response.ok) throw new Error('Failed to create consultation via API');
      return response.json();
    },

    async update(id: number, consultation: any): Promise<any> {
      if (isConfigured) {
        try {
          const dbData = mapConsultationToDb(consultation);
          const { data, error } = await supabase
            .from('consultations')
            .update(dbData)
            .eq('id', id)
            .select()
            .single();
          if (!error && data) {
            return mapConsultationToClient(data);
          }
          console.warn('Supabase consultations update error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase consultations update exception:', e);
        }
      }

      // Fallback
      const response = await fetch(`/api/consultations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(consultation),
      });
      if (!response.ok) throw new Error('Failed to update consultation via API');
      return response.json();
    },

    async delete(id: number): Promise<any> {
      if (isConfigured) {
        try {
          const { error } = await supabase
            .from('consultations')
            .delete()
            .eq('id', id);
          if (!error) {
            return { success: true };
          }
          console.warn('Supabase consultations delete error, falling back to local server:', error);
        } catch (e) {
          console.error('Supabase consultations delete exception:', e);
        }
      }

      // Fallback
      const response = await fetch(`/api/consultations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete consultation via API');
      return response.json();
    },
  },
};
