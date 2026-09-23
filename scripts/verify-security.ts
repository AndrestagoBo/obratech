/**
 * Pruebas de las defensas que no se ven al usar el sitio.
 *
 * Corre con `npm run test:security`. No escribe nada: solo lee `data/site.json`.
 *
 * Lo que cuida:
 *  - Que la firma del estado del chat siga cuadrando después del viaje por JSON.
 *    Esto depende de que `cleanAssistantState` sea idempotente y arme siempre
 *    las mismas claves en el mismo orden. Si alguien le agrega un campo sin
 *    mantener esa propiedad, el chat se reiniciaría solo en cada turno y aquí
 *    se nota antes de publicarlo.
 *  - Que un estado inventado no pueda colar una solicitud.
 *  - Que ningún contenido malformado pueda romper la forma de site.json.
 */
import { answerLocally, shouldSaveLead, type AssistantState } from "../lib/assistant-local";
import { signState, verifiedState } from "../lib/state-signature";
import { readSiteContent, sanitizeSiteContent } from "../lib/site-store";

process.env.ADMIN_SECRET ||= "secreto-solo-para-esta-prueba";

let fallos = 0;
function check(nombre: string, ok: boolean, extra = "") {
  console.log(`${ok ? "OK   " : "FALLA"} ${nombre}${extra ? ` — ${extra}` : ""}`);
  if (!ok) fallos++;
}

async function main() {
  const site = await readSiteContent();
  const vacio = JSON.stringify({ jobs: [], current: 0 });

  console.log("Firma del estado del chat");

  const turnos = ["Necesito pintar la sala", "Chapinero", "1 habitación", "sí", "Valentina", "3001234567"];
  let state: AssistantState = { jobs: [], current: 0 };
  let sig = "";
  let revalidadas = 0;

  for (const mensaje of turnos) {
    // Imita exactamente lo que hace el navegador: guardar y reenviar por JSON.
    const round = JSON.parse(JSON.stringify({ state, sig })) as { state: unknown; sig: string };
    const recuperado = verifiedState(round.state, round.sig);

    if (sig) {
      if (JSON.stringify(recuperado) === vacio) {
        check(`la firma cuadra tras el viaje JSON en "${mensaje}"`, false);
      } else {
        revalidadas++;
      }

      const equivalente =
        recuperado.jobs.length === state.jobs.length &&
        recuperado.zona === state.zona &&
        recuperado.cobertura === state.cobertura &&
        recuperado.confirmed === (state.confirmed ?? false) &&
        recuperado.name === state.name &&
        recuperado.phone === state.phone &&
        recuperado.jobs.every(
          (j, i) => j.step === state.jobs[i].step && j.trabajo === state.jobs[i].trabajo,
        );
      check(`el estado recuperado es equivalente en "${mensaje}"`, equivalente);
    }

    state = answerLocally(mensaje, site, recuperado).state;
    sig = signState(state);
  }

  check(`todos los turnos revalidaron (${revalidadas}/${turnos.length - 1})`, revalidadas === turnos.length - 1);

  console.log("\nEstado inventado");

  const forjado = {
    jobs: [{ kind: "pintura", trabajo: "sala", step: 9, answers: ["x"] }],
    current: 0,
    zona: "Chapinero",
    cobertura: "ok",
    confirmed: true,
    name: "Atacante",
    phone: "3009999999",
  };

  check("sin firma se descarta", !shouldSaveLead(verifiedState(forjado, undefined)));
  check("con firma basura se descarta", !shouldSaveLead(verifiedState(forjado, "a".repeat(64))));
  check(
    "con la firma de otro estado se descarta",
    !shouldSaveLead(verifiedState(forjado, signState({ jobs: [], current: 0 }))),
  );
  check("el primer mensaje sin firma arranca limpio", verifiedState(undefined, undefined).jobs.length === 0);

  console.log("\nSaneado de contenido");

  const basura = sanitizeSiteContent(
    {
      whatsappNumber: "",
      badges: "esto no es una lista",
      servicios: [null, 42, { title: "Pintura" }, { desc: "sin titulo" }],
      proyectos: { no: "es lista" },
      faq: "texto",
      zonas: [],
      porqueNosotros: [{ t: "A", d: 5 }],
      cotizador: [{ label: "Muro", pricePerUnit: "abc" }],
      testimonios: "nada",
      empresa: "tampoco",
    },
    site,
  );

  check("badges inválido queda como lista vacía", Array.isArray(basura.badges) && basura.badges.length === 0);
  check("servicios descarta las filas rotas", basura.servicios.length === 1 && basura.servicios[0].id === "pintura");
  check("proyectos no-lista queda como lista", Array.isArray(basura.proyectos));
  const conAntes = sanitizeSiteContent(
    {
      proyectos: [
        {
          title: "Muro",
          city: "Bogotá",
          image: "/images/proyecto1.jpeg",
          antes: "  /images/nosotros-fondo.jpeg  ",
          resultado: "  cubierta que filtraba  ",
        },
        { title: "Solo después", image: "/images/proyecto2.jpeg", antes: "   " },
      ],
    },
    site,
  );
  check("la foto del antes se guarda sin espacios", conAntes.proyectos[0]?.antes === "/images/nosotros-fondo.jpeg");
  check("sin foto del antes no queda el campo", conAntes.proyectos[1]?.antes === undefined);
  check("la línea de resultado se guarda sin espacios", conAntes.proyectos[0]?.resultado === "cubierta que filtraba");
  check("sin resultado no queda el campo", conAntes.proyectos[1]?.resultado === undefined);
  check("faq inválido vuelve al valor por defecto", basura.faq.length > 0);
  check("zonas vacío vuelve al valor por defecto", basura.zonas.length > 0);
  check("whatsappNumber vacío conserva el anterior", basura.whatsappNumber === site.whatsappNumber);
  check("las imágenes conservan su valor anterior", basura.heroImage === site.heroImage);
  check("un bloque de precios no se guarda", !("cotizador" in basura));
  check("empresa no-objeto queda con campos vacíos", basura.empresa?.razonSocial === "");
  check("mostrarTestimonios queda en booleano", basura.mostrarTestimonios === false);
  check("sanear dos veces da lo mismo", JSON.stringify(sanitizeSiteContent(basura, site)) === JSON.stringify(basura));

  console.log(fallos ? `\n${fallos} fallas` : "\nTodo correcto");
  process.exit(fallos ? 1 : 0);
}

main();
