import { NextRequest, NextResponse } from "next/server";
import { UCRMacro, validateMacro } from "ucr-core";

let memoryMacros: UCRMacro[] = [];

export async function GET() {
  return NextResponse.json({ macros: memoryMacros });
}

export async function POST(req: NextRequest) {
  const macro = (await req.json()) as UCRMacro;
  const validation = validateMacro(macro);
  if (!validation.valid) {
    return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 });
  }
  memoryMacros = [...memoryMacros.filter((m) => m.id !== macro.id), macro];
  return NextResponse.json({ success: true, macro });
}
