const battles = [
  {
    title: `Best Song from Chanel Orange`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Pink%20Matter&artist=Frank%20Ocean&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Sierra%20Leone&artist=Frank%20Ocean&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from Prottasha`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Phiriye%20Dao&artist=Miles&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Neela&artist=Miles&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from 'For all the dogs'`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Away%20From%20Home&artist=Drake&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Tried%20Our%20Best&artist=Drake&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Travis song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Stop%20Trying%20To%20Be%20God&artist=Travis%20Scott&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=90210&artist=Travis%20Scott&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Carti song with the most satisfyign SLAT`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Off%20The%20Grid&artist=Kanye%20West&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=ILoveUIHateU&artist=Playboi%20Carti&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from The Wall`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Another%20Brick%20In%20The%20Wall,%20Pt.%202&artist=Pink%20Floyd&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Comfortably%20Numb&artist=Pink%20Floyd&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Most deep kendrick song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Father%20Time%20(feat.%20Sampha)&artist=Kendrick%20Lamar&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=DUCKWORTH.&artist=Kendrick%20Lamar&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Post nut clarity song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=It%20Will%20Rain&artist=Bruno%20Mars&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=24&artist=Kanye%20West&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song to play at a wedding`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Hey%20ya!&artist=Outkast&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Every%20Breathe%20You%20Take&artist=The%20Police&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best thom yorke squils`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Lotus%20Flower&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=2%2B2%3D5&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from 'Ok Computer'`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Let%20Down&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Exit%20Music(For%20a%20film)&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from 'Kid A'`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Everything%20in%20it%27s%20right%20place&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Motion%20Picture%20Soundtrack&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Canterburry prog song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Moon%20in%20June&artist=Soft%20Machine&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Little%20Red%20Robin%20Hood%20Hit%20the%20Road&artist=Robert%20Wyatt&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from In Rainbows`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Reckoner&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Nude&artist=Radiohead&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Song from Emotion-carly rae jepsen`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Run%20away%20with%20me&artist=Carly%20Rae%20Jepsen&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Emotion&artist=Carly%20Rae%20Jepsen&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best Ulver song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=The%20Future%20Sound%20Of%20Music&artist=Ulver&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Bergtatt-Ind%20i%20Fjeldkamrene&artist=Ulver&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Most happy bladee song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Noblest%20strive&artist=Bladee&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Reality%20Surf&artist=Bladee&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
  {
    title: `Best yung lean song`,
    chosenSongs: [
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=Ginseng%20Strip%202002&artist=Yung%20Lean&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
      `https://ws.audioscrobbler.com/2.0/?limit=15&method=track.getInfo&track=sunrise%20angel&artist=Yung%20Lean&api_key=${process.env.LAST_FM_API_KEY}&format=json`,
    ],
  },
]

export default battles
