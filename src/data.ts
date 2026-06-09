/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Riddle, GuessWord, QuizQuestion } from './types.ts';

export const SCRAMBLE_WORDS = [
  "PYTHON", "REACT", "VITE", "APPLET", "GEMINI", "STUDIO", "ARENA", "MOBILE", "TOUCH", "GAMING",
  "FLASK", "TKINTER", "DESIGN", "MODERN", "CLEAN", "FAST", "MIND", "PLAY", "SMART", "GUESS",
  "LOGIC", "PUZZLE", "DYNAMIC", "STATIC", "SCRIPT", "EDITOR", "BINARY", "CLOUD", "DEBUG", "STYLE",
  "WIZARD", "COFFEE", "ENERGY", "FUTURE", "GALAXY", "HELIUM", "ISLAND", "JUNGLE", "KNIPSE", "LUMOS",
  "MATRIX", "NATURE", "ORBITA", "PLANET", "QUARTZ", "RHYTHM", "SPHERE", "THEORY", "UBUNTU", "VECTOR",
  "WIDGET", "XYLONE", "YELLOW", "ZENITH", "ASTRON", "BEACON", "CHROMA", "DRACO", "ETHICS", "FORGE"
];

export const RIDDLES: Riddle[] = [
  {
    id: "r1",
    question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?",
    answer: "ECHO",
    hints: ["It repeats what you say.", "You hear it in mountains."]
  },
  {
    id: "r2",
    question: "The more of this there is, the less you see. What is it?",
    answer: "DARKNESS",
    hints: ["It happens at night.", "You need a light to fight it."]
  },
  {
    id: "r3",
    question: "I have keys, but no locks and space, but no room. You can enter, but never leave. What am I?",
    answer: "KEYBOARD",
    hints: ["You are using it right now.", "It has a space bar."]
  },
  {
    id: "r4",
    question: "What has to be broken before you can use it?",
    answer: "EGG",
    hints: ["You eat it for breakfast.", "It has a yolk."]
  },
  {
    id: "r5",
    question: "What has hands, but can't clap?",
    answer: "CLOCK",
    hints: ["It tells time.", "It has a face."]
  },
  { id: "r6", question: "If I have it, I don’t share it. If I share it, I don’t have it. What is it?", answer: "SECRET", hints: ["Something private.", "Shhh!"] },
  { id: "r7", question: "What has building but no people, mountains but no trees, and water but no fish?", answer: "MAP", hints: ["You use it for navigation.", "It can be paper or digital."] },
  { id: "r8", question: "What can you catch, but not throw?", answer: "COLD", hints: ["It makes you sneeze.", "It's an illness."] },
  { id: "r9", question: "The person who builds it doesn't want it. The person who buys it doesn't use it. The person who uses it doesn't know it. What is it?", answer: "COFFIN", hints: ["Related to the end of life.", "It's a box."] },
  { id: "r10", question: "What has one eye, but can’t see?", answer: "NEEDLE", hints: ["Used for sewing.", "It's sharp."] },
  { id: "r11", question: "What has a neck but no head?", answer: "BOTTLE", hints: ["Holds liquid.", "Has a cap."] },
  { id: "r12", question: "What gets wetter and wetter the more it dries?", answer: "TOWEL", hints: ["Used after a bath.", "Absorbs water."] },
  { id: "r13", question: "What can travel all around the world without leaving its corner?", answer: "STAMP", hints: ["Goes on letters.", "Very small."] },
  { id: "r14", question: "What is full of holes but still holds water?", answer: "SPONGE", hints: ["Used in the kitchen.", "Very porous."] },
  { id: "r15", question: "What behaves like a bird but has no wings?", answer: "KITE", hints: ["Flies in the wind.", "Connected to a string."] },
  { id: "r16", question: "What goes up but never comes down?", answer: "AGE", hints: ["Happens every birthday.", "Number."] },
  { id: "r17", question: "I am light as a feather, yet the strongest man cannot hold me for much more than a minute. What am I?", answer: "BREATH", hints: ["Essential for life.", "In and out."] },
  { id: "r18", question: "If you drop me I’m sure to crack, but give me a smile and I’ll always smile back. What am I?", answer: "MIRROR", hints: ["Shows your reflection.", "Glass."] },
  { id: "r19", question: "What is so fragile that saying its name breaks it?", answer: "SILENCE", hints: ["Quietness.", "Opposite of noise."] },
  { id: "r20", question: "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?", answer: "RIVER", hints: ["Flowing water.", "Freshwater."] },
  { id: "r21", question: "What has many teeth, but cannot bite?", answer: "COMB", hints: ["Used for hair.", "Plastic or wood."] },
  { id: "r22", question: "What has a thumb and four fingers, but is not a hand?", answer: "GLOVE", hints: ["Worn in winter.", "Clothing."] },
  { id: "r23", question: "Where does today come before yesterday?", answer: "DICTIONARY", hints: ["A book of words.", "Alphabetical order."] },
  { id: "r24", question: "What bank never has any money?", answer: "RIVERBANK", hints: ["Side of a river.", "Nature."] },
  { id: "r25", question: "What belongs to you, but others use it more than you do?", answer: "NAME", hints: ["How people call you.", "Identifier."] },
  { id: "r26", question: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?", answer: "FIRE", hints: ["Hot and bright.", "Destructive."] },
  { id: "r27", question: "What kind of coat is always wet when you put it on?", answer: "PAINT", hints: ["Used for walls.", "Liquid."] },
  { id: "r28", question: "Which word in the dictionary is spelled incorrectly?", answer: "INCORRECTLY", hints: ["A play on words.", "Meta riddle."] },
  { id: "r29", question: "Give me food, and I will live; give me water, and I will die. What am I?", answer: "FIRE", hints: ["Needs wood.", "Hot."] },
  { id: "r30", question: "The more you take, the more you leave behind. What are they?", answer: "FOOTSTEPS", hints: ["Left while walking.", "On sand."] },
  { id: "r31", question: "What runs around a whole yard without moving?", answer: "FENCE", hints: ["Wooden or metal.", "Border."] },
  { id: "r32", question: "What has a bottom at the top?", answer: "LEGS", hints: ["Where your pants go.", "Body parts."] },
  { id: "r33", question: "You see a boat filled with people. It has not sunk, but when you look again you don’t see a single person on the boat. Why?", answer: "MARRIED", hints: ["All are married.", "Single vs Married."] },
  { id: "r34", question: "I have lakes with no fish, mountains with no trees, and cities with no houses. What am I?", answer: "MAP", hints: ["Cartography.", "Globe."] },
  { id: "r35", question: "If you quench my thirst I will die, but if you feed me I will live. What am I?", answer: "FIRE", hints: ["Again, fire.", "Thirst for water."] },
  { id: "r36", question: "What can you break, even if you never pick it up or touch it?", answer: "PROMISE", hints: ["A word given.", "Commitment."] },
  { id: "r37", question: "I go through towns and over hills, but I never move. What am I?", answer: "ROAD", hints: ["Street.", "Path."] },
  { id: "r38", question: "I have towns, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "MAP", hints: ["Map again.", "Paper."] },
  { id: "r39", question: "What has words, but never speaks?", answer: "BOOK", hints: ["You read it.", "Library."] },
  { id: "r40", question: "What has a head and a tail but no body?", answer: "COIN", hints: ["Currency.", "Heads or tails?"] },
  { id: "r41", question: "What building has the most stories?", answer: "LIBRARY", hints: ["Books.", "Tales."] },
  { id: "r42", question: "I shave every day, but my beard stays the same. What am I?", answer: "BARBER", hints: ["A profession.", "Shaves others."] },
  { id: "r43", question: "I’m tall when I’m young, and I’m short when I’m old. What am I?", answer: "CANDLE", hints: ["Wax.", "Light."] },
  { id: "r44", question: "A man dies of old age on his 25th birthday. How is this possible?", answer: "LEAP YEAR", hints: ["February 29th.", "Calendar."] },
  { id: "r45", question: "I have no life, but I can die. What am I?", answer: "BATTERY", hints: ["Powers devices.", "Needs charging."] },
  { id: "r46", question: "What has to be broken before you can eat it?", answer: "EGG", hints: ["Breakfast.", "Yolk."] },
  { id: "r47", question: "What is black when you buy it, red when you use it, and gray when you throw it away?", answer: "CHARCOAL", hints: ["BBQ.", "Coal."] },
  { id: "r48", question: "What can you keep after giving it to someone?", answer: "WORD", hints: ["Keep your word.", "Promise."] },
  { id: "r49", question: "What has a heart that doesn’t beat?", answer: "ARTICHOKE", hints: ["A vegetable.", "Heart of it."] },
  { id: "r50", question: "What travels around the world but stays in one spot?", answer: "STAMP", hints: ["Postal.", "Corner."] },
  { id: "r51", question: "I am always hungry and must be fed. The finger I touch will soon turn red. What am I?", answer: "FIRE", hints: ["Hot.", "Flame."] }
];

export const GUESS_WORDS: GuessWord[] = [
  {
    id: "g1",
    category: "Animals",
    word: "ELEPHANT",
    hints: ["It has a long trunk.", "It can be found in the savanna."]
  },
  {
    id: "g2",
    category: "Fruits",
    word: "STRAWBERRY",
    hints: ["It is red and has seeds on the outside.", "It is often used in cakes."]
  },
  {
    id: "g3",
    category: "Countries",
    word: "JAPAN",
    hints: ["The Land of the Rising Sun.", "Famous for Sushi and Anime."]
  },
  {
    id: "g4",
    category: "Technology",
    word: "INTERNET",
    hints: ["A global network of computers.", "You use a browser to access it."]
  },
  {
    id: "g5",
    category: "Space",
    word: "JUPITER",
    hints: ["The largest planet in our solar system.", "It has a Great Red Spot."]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Venus", "Jupiter"],
    answer: "Mars"
  },
  {
    id: "q2",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Madrid", "Paris"],
    answer: "Paris"
  },
  {
    id: "q3",
    question: "Smallest prime number?",
    options: ["0", "1", "2", "3"],
    answer: "2"
  },
  {
    id: "q4",
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    answer: "Carbon Dioxide"
  },
  {
    id: "q5",
    question: "Who developed the theory of relativity?",
    options: ["Isaac Newton", "Albert Einstein", "Galileo", "Stephen Hawking"],
    answer: "Albert Einstein"
  }
];

export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
