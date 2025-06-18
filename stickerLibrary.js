export const stickerLibrary = {
  "u1c1s1": {
    id: "u1c1s1",
    name: "La Variable Misteriosa",
    unlockable: true,
    requirement: "Escribe por qué crees que esta variable es especial.",
    description_fun: "Cuenta la leyenda que cambió tres veces de tipo.",
    description_tech: "Introduce tipos de variable: cualitativa y cuantitativa.",
    image: "stk/u1c1s1.png",
    links: [{ label: "Manual de Estadística", url: "#" }]
  },
  "u1c1s2": {
    id: "u1c1s2",
    name: "Tipo Top",
    unlockable: true,
    requirement: "Explica qué tipo de variable es tu favorita.",
    description_fun: "Solo los sabios diferencian nominal y ordinal sin pestañear.",
    description_tech: "Escalas de medición: nominal, ordinal, intervalo, razón.",
    image: "stk/u1c1s2.png",
    links: []
  },
  "u1c1s3": {
    id: "u1c1s3",
    name: "Conversión Mortal",
    unlockable: false,
    requirement: "",
    description_fun: "Convertir ordinal a continua... y vivir para contarlo.",
    description_tech: "Errores comunes al usar variables categóricas como numéricas.",
    image: "stk/u1c1s3.png",
    links: []
  },

  // Placeholder safe copies for all others
  ...Object.fromEntries(
    Array.from({ length: 3 }, (_, u) =>
      Array.from({ length: 3 }, (_, c) =>
        Array.from({ length: 3 }, (_, s) => {
          const id = `u${u + 1}c${c + 1}s${s + 1}`;
          if (["u1c1s1", "u1c1s2", "u1c1s3"].includes(id)) return null;
          return [
            id,
            {
              id,
              name: `Sticker ${id.toUpperCase()}`,
              unlockable: true,
              requirement: "Reflexiona brevemente por qué mereces esta sticker.",
              description_fun: "Texto narrativo divertido.",
              description_tech: "Contenido académico relacionado.",
              image: `stk/${id}.png`,
              links: []
            }
          ];
        })
      ).flat().filter(Boolean)
    ).flat()
  )
};
