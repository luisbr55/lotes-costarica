import { createClient } from "@supabase/supabase-js";
import costaRica from "./costa-rica.json" with { type: "json" };

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  const provinciaIdPorNombre: Record<string, number> = {};

  for (const provincia of Object.values(costaRica.provincias)) {
    const { data, error } = await supabase
      .from("provincias")
      .insert({ nombre: provincia.nombre })
      .select("id")
      .single();

    if (error) {
      console.error(`Error insertando, provincia: ${provincia.nombre}`, error);
      return;
    }
    provinciaIdPorNombre[provincia.nombre] = data.id;
  }

  console.log(provinciaIdPorNombre);

  const cantonIdPorClave: Record<string, number> = {};

  for (const provincia of Object.values(costaRica.provincias)) {
    const provinciaId = provinciaIdPorNombre[provincia.nombre];

    for (const canton of Object.values(provincia.cantones)) {
      const { data, error } = await supabase
        .from("cantones")
        .insert({ nombre: canton.nombre, provincia_id: provinciaId })
        .select("id")
        .single();

      if (error) {
        console.log(
          `Error insertando canton: ${canton.nombre} de provincia: ${provincia.nombre}`,
          error,
        );
        return;
      }
      cantonIdPorClave[`${provincia.nombre} | ${canton.nombre}`] = data.id;
    }
  }
  console.log(cantonIdPorClave);
  const distritoIdPorClave: Record<string, number> = {};

  for (const provincia of Object.values(costaRica.provincias)) {
    for (const canton of Object.values(provincia.cantones)) {
      const cantonId =
        cantonIdPorClave[`${provincia.nombre} | ${canton.nombre}`];

      for (const distrito of Object.values(canton.distritos)) {
        const { data, error } = await supabase
          .from("distritos")
          .insert({ nombre: distrito, canton_id: cantonId })
          .select("id")
          .single();

        if (error) {
          console.log(
            `Error insertando distrito: ${distrito} de canton: ${canton.nombre} de provincia: ${provincia.nombre}`,
            error,
          );
          return;
        }
        distritoIdPorClave[
          `${provincia.nombre} | ${canton.nombre} | ${distrito}`
        ] = data.id;
      }
    }
  }
}
main();
