export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getRobots } = await import("@/lib/content/robots");
    const robots = getRobots();
    console.log(`[content/robots] loaded ${robots.length} robot(s):`);
    console.log(robots);
  }
}
