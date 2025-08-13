export type DamageImage = string; // URL to image

export interface ReturnCarInput {
  rentalId: string;
  odometerEnd: number;
  damageReport?: string;
  damageImages?: DamageImage[];
  outstandingBalance?: number;
}

export interface ReturnCarResult {
  success: boolean;
  message: string;
}
