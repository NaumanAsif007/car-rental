import { NextResponse } from "next/server";
import { processCarReturn } from "./returnCar";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await processCarReturn(body);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}
