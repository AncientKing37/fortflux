export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      crypto_payments: {
        Row: {
          amount: number
          created_at: string | null
          crypto_currency: string
          fees: number | null
          id: string
          nowpayments_invoice_id: string | null
          payment_status: string | null
          transaction_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          crypto_currency: string
          fees?: number | null
          id?: string
          nowpayments_invoice_id?: string | null
          payment_status?: string | null
          transaction_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          crypto_currency?: string
          fees?: number | null
          id?: string
          nowpayments_invoice_id?: string | null
          payment_status?: string | null
          transaction_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      fortnite_accounts: {
        Row: {
          battle_pass: boolean | null
          created_at: string
          description: string | null
          featured: boolean | null
          id: string
          images: string[] | null
          level: number | null
          price: number
          rarity: string | null
          seller_id: string
          skins: number | null
          status: string | null
          title: string
          updated_at: string
          v_bucks: number | null
        }
        Insert: {
          battle_pass?: boolean | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          level?: number | null
          price: number
          rarity?: string | null
          seller_id: string
          skins?: number | null
          status?: string | null
          title: string
          updated_at?: string
          v_bucks?: number | null
        }
        Update: {
          battle_pass?: boolean | null
          created_at?: string
          description?: string | null
          featured?: boolean | null
          id?: string
          images?: string[] | null
          level?: number | null
          price?: number
          rarity?: string | null
          seller_id?: string
          skins?: number | null
          status?: string | null
          title?: string
          updated_at?: string
          v_bucks?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string
          sender_id: string
          transaction_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
          transaction_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number | null
          created_at: string
          description: string | null
          favorite_listings: string[] | null
          id: string
          ltc_wallet_address: string | null
          preferred_crypto: string | null
          role: string
          username: string
          vouch_count: number | null
          wallet_address: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          description?: string | null
          favorite_listings?: string[] | null
          id: string
          ltc_wallet_address?: string | null
          preferred_crypto?: string | null
          role?: string
          username: string
          vouch_count?: number | null
          wallet_address?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number | null
          created_at?: string
          description?: string | null
          favorite_listings?: string[] | null
          id?: string
          ltc_wallet_address?: string | null
          preferred_crypto?: string | null
          role?: string
          username?: string
          vouch_count?: number | null
          wallet_address?: string | null
        }
        Relationships: []
      }
      support_chats: {
        Row: {
          avatar_url: string | null
          id: string
          is_active: boolean
          last_message: string
          last_message_time: string
          unread_count: number
          user_id: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          id?: string
          is_active?: boolean
          last_message: string
          last_message_time?: string
          unread_count?: number
          user_id: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          id?: string
          is_active?: boolean
          last_message?: string
          last_message_time?: string
          unread_count?: number
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_chats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_admin: boolean
          sender_avatar: string | null
          sender_id: string
          sender_name: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_admin?: boolean
          sender_avatar?: string | null
          sender_id: string
          sender_name: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_admin?: boolean
          sender_avatar?: string | null
          sender_id?: string
          sender_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          account_id: string
          amount: number
          buyer_id: string
          created_at: string
          crypto_amount: number | null
          crypto_type: string | null
          escrow_fee: number | null
          escrow_id: string | null
          id: string
          platform_fee: number | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          account_id: string
          amount: number
          buyer_id: string
          created_at?: string
          crypto_amount?: number | null
          crypto_type?: string | null
          escrow_fee?: number | null
          escrow_id?: string | null
          id?: string
          platform_fee?: number | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          amount?: number
          buyer_id?: string
          created_at?: string
          crypto_amount?: number | null
          crypto_type?: string | null
          escrow_fee?: number | null
          escrow_id?: string | null
          id?: string
          platform_fee?: number | null
          seller_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "fortnite_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      vouches: {
        Row: {
          comment: string | null
          created_at: string
          from_user_id: string
          id: string
          rating: number
          to_user_id: string
          transaction_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          from_user_id: string
          id?: string
          rating: number
          to_user_id: string
          transaction_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          from_user_id?: string
          id?: string
          rating?: number
          to_user_id?: string
          transaction_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouches_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      refund_buyer: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
      }
      release_funds: {
        Args: { p_transaction_id: string; p_user_id: string }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
