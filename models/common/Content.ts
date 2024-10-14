export type Content = Content.Text | Content.Audio
export namespace Content {
  export type Text = {
    type: "input_text"
    text: string
  }

  export type Audio = {
    type: "input_audio"
    audio: string
    transcript?: string
  }
}
