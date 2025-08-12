export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          created_at: string
          event_id: string
          id: string
          message: string
          requester_email: string
          requester_name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          message: string
          requester_email: string
          requester_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          message?: string
          requester_email?: string
          requester_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          description: string
          end_time: string
          event_date: string
          female_ratio: number | null
          guest_limit: number | null
          host_email: string | null
          id: string
          image_url: string | null
          location: string
          male_ratio: number | null
          rsvp_deadline: string | null
          start_time: string
          status: string | null
          title: string
          unlimited_guests: boolean | null
          updated_at: string
          use_ratio_control: boolean | null
        }
        Insert: {
          created_at?: string
          description: string
          end_time: string
          event_date: string
          female_ratio?: number | null
          guest_limit?: number | null
          host_email?: string | null
          id?: string
          image_url?: string | null
          location: string
          male_ratio?: number | null
          rsvp_deadline?: string | null
          start_time: string
          status?: string | null
          title: string
          unlimited_guests?: boolean | null
          updated_at?: string
          use_ratio_control?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string
          end_time?: string
          event_date?: string
          female_ratio?: number | null
          guest_limit?: number | null
          host_email?: string | null
          id?: string
          image_url?: string | null
          location?: string
          male_ratio?: number | null
          rsvp_deadline?: string | null
          start_time?: string
          status?: string | null
          title?: string
          unlimited_guests?: boolean | null
          updated_at?: string
          use_ratio_control?: boolean | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attendee_email: string
          attendee_name: string
          created_at: string
          event_id: string
          gender: string
          id: string
          status: string
        }
        Insert: {
          attendee_email: string
          attendee_name: string
          created_at?: string
          event_id: string
          gender: string
          id?: string
          status?: string
        }
        Update: {
          attendee_email?: string
          attendee_name?: string
          created_at?: string
          event_id?: string
          gender?: string
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          attendee_email: string | null
          attendee_name: string
          created_at: string
          event_id: string
          gender: string
          id: string
          updated_at: string
        }
        Insert: {
          attendee_email?: string | null
          attendee_name: string
          created_at?: string
          event_id: string
          gender: string
          id?: string
          updated_at?: string
        }
        Update: {
          attendee_email?: string | null
          attendee_name?: string
          created_at?: string
          event_id?: string
          gender?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_event_rsvps_for_host: {
        Args: { event_uuid: string; host_email_param: string }
        Returns: {
          id: string
          event_id: string
          attendee_name: string
          attendee_email: string
          gender: string
          status: string
          created_at: string
        }[]
      }
      get_event_waitlist_for_host: {
        Args: { event_uuid: string; host_email_param: string }
        Returns: {
          id: string
          event_id: string
          attendee_name: string
          attendee_email: string
          gender: string
          created_at: string
          updated_at: string
        }[]
      }
      get_gender_spots_remaining: {
        Args: { event_uuid: string; target_gender: string }
        Returns: number
      }
      get_public_rsvps: {
        Args: { event_uuid: string }
        Returns: {
          id: string
          event_id: string
          attendee_name: string
          gender: string
          status: string
          created_at: string
        }[]
      }
      get_spots_remaining: {
        Args: { event_uuid: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
