export type ContentResource = ContentResource.Text | ContentResource.Audio
export namespace ContentResource {
  export type Text = {
    type: "text"
    text: string
  }

  export type Audio = {
    type: "audio"
    audio: string
    transcript: string
  }
}
