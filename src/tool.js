const backup = Deno.env.get("CL_LMP_BACKUP");
import { create, web_deal } from "fpng-sign-serve";
const site = {};
site.page = Deno.readTextFileSync("assets/page.html");
site.css = Deno.readTextFileSync("assets/style.css");
site.model = Deno.readTextFileSync("assets/data_material_large.txt");
create(site,backup)
Deno.serve({
  port: 3052,
  hostname: "0.0.0.0",
  handler: (req) => web_deal(req),
});
