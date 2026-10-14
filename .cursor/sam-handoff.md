# Sam handoff — Falamigos

Do the how. The what is already decided. Don't ask whether to do it.

When you finish an item, mark it `[x]` in this file. Sam is watching.

## Where it stands
First fono feedback validated the core loop (1-in-10 compliance baseline, voice awareness is the clinical hook, regional accent matters). Now building the progression mechanic: 10 sessions = Chico + 9 friends per world, unlocked sequentially. Chico's 9 friends art is ready to wire up.

## Do
- [x] Move all 9 PNGs from brand/chico-friends/ into app/assets/mundos/chico-friends/
- [x] Create app/src/data/friends.ts with friendsFundoDoMar array (9 creatures: Xuxa, Chuca, Xande, Ficha, Tacho, Peixoto, Michela, Chama, Bolacha)
- [x] Add getSessionCount() and incrementSessionCount() to app/src/lib/storage.ts
- [x] Call incrementSessionCount() at end of sessao.tsx (after egg hatch), store result to unlock next friend
- [x] Update colecao.tsx: show Chico + unlocked friends (based on sessionCount), grey out locked ones
- [x] Update mapa.tsx: render 10-spot road below Chico (spot 0 = Chico, spots 1–9 = friends), show unlocked creature art or silhouette placeholders
- [ ] História diária pós-treino: em cada dia com treino, gerar uma história para os pais lerem à criança que use exactamente as palavras do treino desse dia (Daniel implementa depois)

## Talk
**Daniel:** No, what I want you to do is to now try to find all those characters for all the worlds and so on so I can start producing them.

**Sam:** Alright, let me map out what we know and what's missing.

From `worlds.json` I can see:
- 6 worlds
- 6 mascots with names

But I don't see the **phoneme assigned to each world**. You mentioned:
- Fundo do Mar → Chico → /ʃ/ (CH/X)

What are the target phonemes for the other 5 worlds?
- Espaço → Cosmo → ?
- Dinossauros → Dara → ?
- Reino Mágico → Brilha → ?
- Futebol → Craque → ?
- Safári → Bárbara → ?

Once I have those, I can generate the 9 friend names for each world based on the phoneme. Do you have that mapping already, or do we need to decide it now?

**Daniel:** A família oficial, fechada:

Universo	Personagem	Nome	Fonema que carrega	Onde mora no nome
Fundo do Mar	polvo	Chico	/ʃ/ — CH/X	CHi-co
Dinossauros	dinossaura	Dara	/ɾ/ — r fraco intervocálico	Da-Ra
Espaço	criatura estelar	Cosmo	coda S — S de trava	CoS-mo
Reino Mágico	fada	Brilha	/ʎ/ — LH	Bri-LHa (com "br" de bónus)
Futebol	craque	Craque	grupos consonantais com R	CRa-que
Safári	leoa	Bárbara	R de trava (arquifonema)	BáR-ba-Ra (trava + r fraco de bónus)

**Sam:** Perfect. Now I'll generate the 9 friends for each world:

---

## **Fundo do Mar — Chico — /ʃ/ (CH/X)**

1. **Xuxa** (peixe-palhaço)
2. **Chuca** (lula)
3. **Xande** (cavalo-marinho)
4. **Ficha** (tartaruga)
5. **Tacho** (caranguejo)
6. **Peixoto** (peixe grande)
7. **Michela** (estrela-do-mar)
8. **Chama** (anêmona)
9. **Bolacha** (ouriço-do-mar)

---

## **Dinossauros — Dara — /ɾ/ (R fraco intervocálico)**

1. **Tira** (tiranossauro bebê)
2. **Cora** (tricerátops)
3. **Pêra** (pterodáctilo)
4. **Fúria** (velociraptor)
5. **Mira** (braquiossauro)
6. **Bira** (estegossauro)
7. **Cero** (anquilossauro)
8. **Dira** (diplodoco)
9. **Jurema** (compsognathus)

---

## **Espaço — Cosmo — /s/ em coda (S de trava)**

1. **Vespa** (nave-abelha)
2. **Casca** (asteroide vivo)
3. **Mosco** (satélite inseto)
4. **Faisca** (cometa pequeno)
5. **Bosque** (planeta-floresta)
6. **Fosco** (lua cinza)
7. **Cisco** (poeira estelar animada)
8. **Tosco** (robô desajeitado)
9. **Castor** (alienígena construtor)

---

## **Reino Mágico — Brilha — /ʎ/ (LH)**

1. **Folha** (sprite verde)
2. **Telha** (dragão de telhado)
3. **Agulha** (fada espinho)
4. **Orelha** (coelho mágico)
5. **Abelha** (abelha encantada)
6. **Joelho** (gnomo baixinho)
7. **Coelho** (guardião do reino)
8. **Espelho** (espírito reflexivo)
9. **Velho** (sábio da floresta)

---

## **Futebol — Craque — grupos consonantais com R (CR, BR, TR, etc.)**

1. **Bravo** (goleiro urso)
2. **Trova** (papagaio narrador)
3. **Bruxa** (mascote da torcida)
4. **Truque** (meia habilidoso)
5. **Frida** (atacante feroz)
6. **Grogu** (zagueiro pequeno e forte)
7. **Prata** (taça troféu vivo)
8. **Dragão** (mascote do estádio)
9. **Crosta** (bola de lama animada)

---

## **Safári — Bárbara — /R/ de trava (arquifonema)**

1. **Ágata** (elefanta — /R/ ausente, mas mantém tema; alternativa: **Marfim**)
2. **Martelo** (tubarão-martelo, fora d'água!)
3. **Garça** (ave)
4. **Porta** (hipopótamo)
5. **Sorte** (zebra)
6. **Corça** (gazela)
7. **Parque** (rinoceronte)
8. **Carta** (macaco escriba)
9. **Forte** (leão)

---

Wait — **Ágata** doesn't have /R/ de trava. Let me fix Safári:

## **Safári — Bárbara — /R/ de trava (arquifonema) — REVISED**

1. **Marfim** (elefante)
2. **Martelo** (javali)
3. **Garça** (ave)
4. **Corça** (gazela)
5. **Sorte** (zebra)
6. **Parque** (rinoceronte)
7. **Porta** (hipopótamo)
8. **Carta** (macaco)
9. **Forte** (leão)

---

**That's 54 creature names, all phoneme-aligned, all thematic.**

Ready to add to your todos?

**Daniel:** So I have created the friends of Chico. Please prepare next moves where I'll send everything to cursor. I'll give him the proper guidance where the images are, and I want it implemented.

**Sam:** **Next moves for Cursor:**

---

### 1. Move the creature art into the app
Copy all 9 PNG files from `brand/chico-friends/` into `app/assets/mundos/chico-friends/`

---

### 2. Create the friends data file
Create `app/src/data/friends.ts`:

```typescript
export type Friend = {
  id: string;
  nome: string;
  universoId: string;
  /** require() do PNG */
  arte: number;
};

export const friendsFundoDoMar: Friend[] = [
  { id: 'xuxa', nome: 'Xuxa', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-xuxa.png') },
  { id: 'chuca', nome: 'Chuca', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-chuca.png') },
  { id: 'xande', nome: 'Xande', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-xande.png') },
  { id: 'ficha', nome: 'Ficha', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-ficha.png') },
  { id: 'tacho', nome: 'Tacho', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-tacho.png') },
  { id: 'peixoto', nome: 'Peixoto', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-peixoto.png') },
  { id: 'michela', nome: 'Michela', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-michela.png') },
  { id: 'chama', nome: 'Chama', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-chama.png') },
  { id: 'bolacha', nome: 'Bolacha', universoId: 'fundo_do_mar', arte: require('../../assets/mundos/chico-friends/chico-friend-bolacha.png') },
];
```

---

### 3. Add session counter to storage
In `app/src/lib/storage.ts`, add:

```typescript
export async function getSessionCount(): Promise<number> {
  const val = await AsyncStorage.getItem('session_count');
  return val ? parseInt(val, 10) : 0;
}

export async function incrementSessionCount(): Promise<number> {
  const current = await getSessionCount();
  const next = current + 1;
  await AsyncStorage.setItem('session_count', String(next));
  return next;
}
```

---

### 4. Unlock friend after session
At the end of `app/app/sessao.tsx`, after the invocation/hatch screen, call:

```typescript
import { incrementSessionCount } from '@/lib/storage';

// ... after egg hatch animation
const sessionNum = await incrementSessionCount();
// sessionNum is now 1, 2, 3... which maps to friendsFundoDoMar[sessionNum - 1]
```

---

### 5. Update collection screen
In `app/app/colecao.tsx`:
- Read `sessionCount` from storage
- Show Chico (always unlocked) + `friendsFundoDoMar.slice(0, sessionCount)` as unlocked
- Show the rest greyed out with lock icons

---

### 6. Update map screen
In `app/app/mapa.tsx`:
- Below Chico, render a horizontal road with 10 spots
- Spot 0 = Chico (always visible)
- Spots 1–9 = friends, unlocked based on `sessionCount`
- Use the friend's `arte` for each unlocked spot, a placeholder silhouette for locked ones

---

**That's the full loop.** Session → unlock → collection + map both show progress.

**Daniel:** Bro, there's a next moves on your side and it talks with cursor, so understand what it does and do it.

**Sam:** Done. Six moves, ready to ship to Cursor. Art → data → storage → session hook → UI updates.

## Repo
`/Users/danieloiteiro/Documents/gigs/falamigos`
