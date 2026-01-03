// app/api/proxy/route.ts

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
  
    if (!url) {
      return new Response("Missing URL", { status: 400 });
    }
  
    try {
      const response = await fetch(url);
      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const arrayBuffer = await response.arrayBuffer();
  
      return new Response(arrayBuffer, {
        status: response.status,
        headers: {
          "Content-Type": contentType,
        },
      });
    } catch (error) {
      return new Response("Failed to fetch resource", { status: 500 });
    }
  }
  