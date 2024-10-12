// const stream = await navigator.mediaDevices.getUserMedia({
//   video: false,
//   audio: true,
// })
// const ctx = new AudioContext()
// const mic = ctx.createMediaElementSource(stream)
// const spe = ctx.createAnalyser()
// spe.fftSize = 256
// const bufferLength = spe.frequencyBinCount
// const dataArray = new Uint8Array(bufferLength)
// spe.getByteFrequencyData(dataArray)
// mic.connect(spe)
// spe.connect(ctx.destination)
// draw()

// const oscillatorNode = ctx.createOscillator()
// const gainNode = ctx.createGain()
// oscillatorNode.connect(gainNode)
// gainNode.connect(ctx.destination)
// oscillatorNode.start(0)
// ctx
