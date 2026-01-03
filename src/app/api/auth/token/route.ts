import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access")?.value;
    return Response.json({ accessToken });
}
