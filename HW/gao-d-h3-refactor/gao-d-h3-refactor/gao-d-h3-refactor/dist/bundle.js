(()=>{"use strict";var e=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},n=function(e,n){var a=document.querySelector("#search-by"),t=document.querySelector("#num-results");return!(e.length<=0&&t&&("level"===(null==a?void 0:a.value)&&isNaN(Number(n))?t.innerHTML="Please input a NUMBER between 1 and 60 (inclusive) in order to search by LEVEL or choose DEFINITION in the search by dropdown.":"def"!==(null==a?void 0:a.value)||isNaN(Number(n))?t.innerHTML='No results found for "'.concat(n,'"'):t.innerHTML="Please input a WORD in order to search by DEFINITION or choose LEVEL in the search by dropdown.",1))},a=function(e){var n=document.querySelector("#extra-info");n&&(n.innerHTML=e)},t=function(){a('\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">How does the Japanese Language Work?</h2>\n    <p>In very simplified terms, Japanese has three core written language systems: \n      <a href="https://simple.wikipedia.org/wiki/Katakana" target="_blank" rel="noopener">katakana</a>, \n      <a href="https://simple.wikipedia.org/wiki/Hiragana" target="_blank" rel="noopener">hiragana</a>, and \n      <a href="https://simple.wikipedia.org/wiki/Kanji" target="_blank" rel="noopener">kanji</a>.\n      Hiragana and katakana have phonetic sounds associated with each symbol. Kanji can be represented using hiragana, \n      though it is typically represented with symbols similar to Chinese, where each symbol has a meaning.\n    </p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">What are levels?</h2>\n    <p>The WaniKani site sorts all their radicals, kanji, and vocabulary into levels, separated again into blocks of 10.\n      The site is intended as a learning platform for Japanese writing systems, so the levels are there as a sort of \n      indicator of the user\'s progress. As such, WaniKani\'s beginning level is labeled as "Pleasant"; the middle levels \n      are "Painful", "Death", and "Hell"; and the final levels are described as "Paradise" and "Reality". As levels \n      increase, the radicals, kanji, and vocabulary get less common and more complex.\n    </p>');var e=document.querySelector("#num-results");e&&(e.innerHTML="");var n=document.querySelector("#display");n&&(n.innerHTML="")},i=[],r=[],o=[],s="",c=new Headers({Authorization:"Bearer 89abe689-ce3d-4035-acfd-65d442782f72"}),h="dg8516-",l=h+"term",d=h+"type",u=h+"searchBy",p=localStorage.getItem(l),m=localStorage.getItem(d),g=localStorage.getItem(u);window.onload=function(){var e=document.querySelector("#search-term"),n=document.querySelector("#type"),a=document.querySelector("#search-by");document.querySelector("#search").addEventListener("click",f),t(),document.querySelector("#title").addEventListener("click",t),e.addEventListener("change",y),n.addEventListener("change",y),a.addEventListener("change",y),n.addEventListener("change",I),e.value=p||"summer",n.value=m||"",a.value=g||"",v("radical","https://api.wanikani.com/v2/subjects?types=radical"),v("kanji","https://api.wanikani.com/v2/subjects?types=kanji"),v("vocabulary","https://api.wanikani.com/v2/subjects?types=vocabulary")};var y=function(){localStorage.setItem(l,document.querySelector("#search-term").value),localStorage.setItem(d,document.querySelector("#type").value),localStorage.setItem(u,document.querySelector("#search-by").value)},f=function(){var e=document.querySelector("#type").value,n=document.querySelector("#search-by").value,a=document.querySelector("#num-results");s=document.querySelector("#search-term").value.trim(),document.querySelector("#display").innerHTML="",""===s?a.innerHTML="level"===n?"Please input a number between 1 and 60 (inclusive)!":"Please input a word into the search bar!":(a.innerHTML="Searching for ".concat("def"===n?"definitions":"words",' that match "').concat(s,'"'),"def"===n?j(e,x(e)):"level"===n&&w(e,x(e)))},v=function(e,n){fetch(new Request(n,{method:"GET",headers:c})).then((function(e){return e.json()})).then((function(n){var a=n.data;n.pages.next_url?b(a,e,n.pages.next_url):o=a}))},b=function(e,n,a){fetch(new Request(a,{method:"GET",headers:c})).then((function(e){return e.json()})).then((function(a){var t=e.concat(a.data);a.pages.next_url?b(t,n,a.pages.next_url):k(n,t)}))},k=function(e,n){switch(e){case"kanji":i=n;break;case"vocabulary":r=n;break;case"radical":o=n}},w=function(e,a){var t=a.filter((function(e){return e.data.level===parseInt(s)}));n(t,s)&&(document.querySelector("#num-results").innerHTML="<p>".concat(t.length," result(s) for level ").concat(s," ").concat(e,"</p>"),document.querySelector("#display").innerHTML=S(e,t))},j=function(a,t){var i=t.filter((function(n){return n.data.meanings.some((function(n){return n.meaning===s.split(" ").map(e).join(" ")}))}));n(i,s)&&(document.querySelector("#num-results").innerHTML="<p>".concat(i.length,' result(s) for "').concat(s,'"</p>'),document.querySelector("#display").innerHTML=S(a,i))},x=function(e){switch(e){case"kanji":return i;case"vocabulary":return r;case"radical":return o;default:return[]}},S=function(e,n){return n.map((function(n){return q(e,n)})).join("")},q=function(e,n){switch(e){case"radical":return'<div class="box is-rounded has-background-danger-light has-text-centered">\n        <p id="identifier">Identifier: '.concat(n.data.meanings[0].meaning,'</p>\n        <p id="character">Character: ').concat(n.data.characters,'</p>\n        <p id="level">Level: ').concat(n.data.level,"</p>\n      </div>");case"kanji":var a=T(n.data.readings||[],"onyomi"),t=T(n.data.readings||[],"kunyomi");return'<div class="box is-rounded has-background-danger-light has-text-centered">\n        <p id="meanings">Meanings: '.concat(L(n),'</p>\n        <p id="onyomi">Onyomi: ').concat(a||"None",'</p>\n        <p id="kunyomi">Kunyomi: ').concat(t||"None",'</p>\n        <p id="slug">Kanji: ').concat(n.data.characters,'</p>\n        <p id="level">Level: ').concat(n.data.level,"</p>\n      </div>");case"vocabulary":return'<div class="box is-rounded has-background-danger-light has-text-centered">\n        <p id="meanings">Meanings: '.concat(L(n),'</p>\n        <p id="readings">Kana: ').concat(n.data.readings[0].reading,'</p>\n        <p id="slug">Kanji: ').concat(n.data.characters,'</p>\n        <p id="level">Level: ').concat(n.data.level,"</p>\n      </div>")}return""},L=function(e){return e.data.meanings.map((function(e){return e.meaning})).join(", ")},T=function(e,n){return e.filter((function(e){return e.type===n})).map((function(e){return e.reading})).join(", ")},I=function(){switch(document.querySelector("#type").value){case"radical":a('\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">What are radicals?</h2>\n    <p>Radicals technically do not have definitions, but kanji are made up of individual radicals, which can provide \n      clues to kanji\'s definition. Definitions are unique and non-overlapping to aid memorization.\n    </p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">How do they decide what definitions radicals have?</h2>\n    <p>Definitions are often derived from recognizable real-life objects or based on kanji usage, with mnemonics used \n      to aid memory. Example: WaniKani\'s mnemonic for 食 is "You put on your hat and go outside to kick something \n      white. It\'s a big white goose, and you\'re going to cook and <em>eat</em> it."\n    </p>');break;case"kanji":a('<h2 class="is-size-4 pt-3 has-text-weight-semibold">What is kanji?</h2>\n    <p>Kanji is Japanese writing system that utilizes Chinese characters to express meaning.</p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Onyomi?</h2>\n    <p>Each kanji has either one or several onyomi and kunyomi pronunciations associated with it. Onyomi is the reading for the Kanji\n     that is derived from the actual Chinese pronunciations of the character in question. For example in Chinese the character 山 is \n     pronounced like "sān" with a emphasis on the a. In Japanese the onyomi is also pronounced and represented in writing as "san" or \n     「さん」, though it is not an exact 1:1 match in onyomi and chinese pronunciation for many other kanji.\n    </p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Kunyomi?</h2>\n    <p>Kunyomi is like the same as onyomi but this time is the original Japanese created reading and pronunciation.\n     山: ya|ma or 「やま」。\n    </p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">When do I use onyomi?</h2>\n    <p>Written down the onyomi and kunyomi readings are not relevant as just the kanji character is used, but when pronounced \n     or read the different readings are important. Onyomi is usually used when the kanji is placed next to another kanji in a \n     sentence or phrase. For instance the vocabulary word: 「三人」is composed of the kanji characters that mean: three + people.\n      As they are both kanji, the kanji for three is pronounced as "san" or 「さん」, the same way as in chinese. The kanji for \n      people then is pronounced as "nin" or 「にん」. \n    </p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">When do I use kunyomi?</h2>\n    <p>If the kanji is not placed next to other kanji, shown in 「大きい」since 「きい」is not kanji, then the kunyomi pronunciation\n    is used in addition to the other Japanese characters present. Other instances for when the kunyomi is used would be if the \n    kanji character is by itself or if the vocabulary word is a compound word such as 「青葉」young + leaves then the kunyomi \n    pronunciations are used as in あお＋ば.\n    </p>');break;case"vocabulary":a('<h2 class="is-size-4 pt-3 has-text-weight-semibold">Vocabulary?</h2>        \n    <p>Japanese vocabulary encompasses pretty much all all the words that you would say in Japanese. From verbs to adverbs, nouns,\n        pronouns, adjectives, etc. Try out some "to" verbs, like "to die", "to fall down" or other common phrases like "lack of \n        filial piety. (Check out one of the definitions for "national treasure)". \n    </p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Kana</h2>\n    <p>Kana is just the pronunciation of the vocabulary visualized in <a href="https://en.wikipedia.org/wiki/Hiragana" target="_blank" rel="noopener">hiragana</a>.</p>\n    <h2 class="is-size-4 pt-3 has-text-weight-semibold">Kanji?</h2>\n    <p>Kanji are the symbolic characters taken from Chinese scripture which contain meaning. Kanji will often be paired up with \n      simpler looking characters such as: え、て、る、し、etc, which are hiragana. These hiragana attached to the end of the kanji\n      alters the meaning of the kanji slightly. For instance 「泳」has a kanji definition of "swim". If a 「ぐ」is attached to the \n      end of the kanji to become 「泳ぐ」, the definition then becomes "to swim" which is also a verb.\n    </p>')}}})();
//# sourceMappingURL=bundle.js.map