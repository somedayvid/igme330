// //four remaining functions are all little sections for possible FAQs for each type in Japanese since I got a lot of 
// //questions about what things do during the feedback inclass portion I thought I should maybe explain some things
// //for people who don't know anything about Japanese
const setExtraInfoContent = (content: string) => {
  const extraInfoElement = document.querySelector("#extra-info") as HTMLElement;
  if (extraInfoElement) {
    extraInfoElement.innerHTML = content;
  }
};

const showHomeInfo = () => {
  setExtraInfoContent(`
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">How does the Japanese Language Work?</h2>
    <p>In very simplified terms, Japanese has three core written language systems: 
      <a href="https://simple.wikipedia.org/wiki/Katakana" target="_blank" rel="noopener">katakana</a>, 
      <a href="https://simple.wikipedia.org/wiki/Hiragana" target="_blank" rel="noopener">hiragana</a>, and 
      <a href="https://simple.wikipedia.org/wiki/Kanji" target="_blank" rel="noopener">kanji</a>.
      Hiragana and katakana have phonetic sounds associated with each symbol. Kanji can be represented using hiragana, 
      though it is typically represented with symbols similar to Chinese, where each symbol has a meaning.
    </p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">What are levels?</h2>
    <p>The WaniKani site sorts all their radicals, kanji, and vocabulary into levels, separated again into blocks of 10.
      The site is intended as a learning platform for Japanese writing systems, so the levels are there as a sort of 
      indicator of the user's progress. As such, WaniKani's beginning level is labeled as "Pleasant"; the middle levels 
      are "Painful", "Death", and "Hell"; and the final levels are described as "Paradise" and "Reality". As levels 
      increase, the radicals, kanji, and vocabulary get less common and more complex.
    </p>`);
  
  const numResultsElement = document.querySelector("#num-results");
  if (numResultsElement) {
      numResultsElement.innerHTML = "";
  }
  const displayElement = document.querySelector("#display");
  if (displayElement) {
    displayElement.innerHTML = "";
  }

};

const explainRadicals = () => {
  setExtraInfoContent(`
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">What are radicals?</h2>
    <p>Radicals technically do not have definitions, but kanji are made up of individual radicals, which can provide 
      clues to kanji's definition. Definitions are unique and non-overlapping to aid memorization.
    </p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">How do they decide what definitions radicals have?</h2>
    <p>Definitions are often derived from recognizable real-life objects or based on kanji usage, with mnemonics used 
      to aid memory. Example: WaniKani's mnemonic for 食 is "You put on your hat and go outside to kick something 
      white. It's a big white goose, and you're going to cook and <em>eat</em> it."
    </p>`);
};

  const explainKanji = () => {
    setExtraInfoContent(
    `<h2 class="is-size-4 pt-3 has-text-weight-semibold">What is kanji?</h2>
    <p>Kanji is Japanese writing system that utilizes Chinese characters to express meaning.</p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Onyomi?</h2>
    <p>Each kanji has either one or several onyomi and kunyomi pronunciations associated with it. Onyomi is the reading for the Kanji
     that is derived from the actual Chinese pronunciations of the character in question. For example in Chinese the character 山 is 
     pronounced like "sān" with a emphasis on the a. In Japanese the onyomi is also pronounced and represented in writing as "san" or 
     「さん」, though it is not an exact 1:1 match in onyomi and chinese pronunciation for many other kanji.
    </p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Kunyomi?</h2>
    <p>Kunyomi is like the same as onyomi but this time is the original Japanese created reading and pronunciation.
     山: ya|ma or 「やま」。
    </p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">When do I use onyomi?</h2>
    <p>Written down the onyomi and kunyomi readings are not relevant as just the kanji character is used, but when pronounced 
     or read the different readings are important. Onyomi is usually used when the kanji is placed next to another kanji in a 
     sentence or phrase. For instance the vocabulary word: 「三人」is composed of the kanji characters that mean: three + people.
      As they are both kanji, the kanji for three is pronounced as "san" or 「さん」, the same way as in chinese. The kanji for 
      people then is pronounced as "nin" or 「にん」. 
    </p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">When do I use kunyomi?</h2>
    <p>If the kanji is not placed next to other kanji, shown in 「大きい」since 「きい」is not kanji, then the kunyomi pronunciation
    is used in addition to the other Japanese characters present. Other instances for when the kunyomi is used would be if the 
    kanji character is by itself or if the vocabulary word is a compound word such as 「青葉」young + leaves then the kunyomi 
    pronunciations are used as in あお＋ば.
    </p>`);
  }
  
  const explainVocabulary = () => {
    setExtraInfoContent( 
    `<h2 class="is-size-4 pt-3 has-text-weight-semibold">Vocabulary?</h2>        
    <p>Japanese vocabulary encompasses pretty much all all the words that you would say in Japanese. From verbs to adverbs, nouns,
        pronouns, adjectives, etc. Try out some "to" verbs, like "to die", "to fall down" or other common phrases like "lack of 
        filial piety. (Check out one of the definitions for "national treasure)". 
    </p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Kana</h2>
    <p>Kana is just the pronunciation of the vocabulary visualized in <a href="https://en.wikipedia.org/wiki/Hiragana" target="_blank" rel="noopener">hiragana</a>.</p>
    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Kanji?</h2>
    <p>Kanji are the symbolic characters taken from Chinese scripture which contain meaning. Kanji will often be paired up with 
      simpler looking characters such as: え、て、る、し、etc, which are hiragana. These hiragana attached to the end of the kanji
      alters the meaning of the kanji slightly. For instance 「泳」has a kanji definition of "swim". If a 「ぐ」is attached to the 
      end of the kanji to become 「泳ぐ」, the definition then becomes "to swim" which is also a verb.
    </p>`);
  }


export { showHomeInfo, explainRadicals, explainKanji, explainVocabulary };
