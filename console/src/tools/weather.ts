// TODO

import { zodFunction } from "openai/helpers/zod"
import { z } from "zod"

export const WeatherParams = z.object({
  lat: z.number({ description: "Latitude" }),
  lng: z.number({ description: "Longitude" }),
  location: z.string({ description: "Name of the location" }),
})

export const weather = zodFunction({
  name: "",
  parameters: WeatherParams,
  description: "",
  async function({ lat, lng }) {
    return await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`,
    ).then((v) => v.json())
  },
})
