# Check List

## Single:

1. can't be judged
2. can be judged now
3. judged

### 1 -> 2
- [x] interval check
  
### 2 -> 3
- [x] time out miss
- [x] pointer down check

---

## Flick

1. can't be judged
2. can be judged now
3. holding but not flicked out
4. judged

### 1 -> 2
- [x] interval check

### 2 -> 3
- [x] pointer down
  - [x] add to holding flick list
  - [x] set pointer id

### 2 -> 4
- [x] time out
  - [x] remove from holding flick list

### 3 -> 4
- [x] pointer move
  - [x] remove from holding flick list
- [x] time out
  - [x] remove from holding flick list

---

## Slide Start

1. can't be judged
2. can be judged
3. judged


### 1 -> 2
- [x] interval check
  
### 2 -> 3
- [x] time out miss
  - [x] parent next judge index change
- [x] pointer down check
  - [x] parent next judge index change
  - [x] parent pointer id set
  - [x] add to holding slide list
- [x] next note come
  - [x] parent next judge index change

---

## Slide Among

1. can't be judged
2. can be judged as holding slide mid
3. can be judged as slide start
4. judged

### 1 -> 2
- [x] interval check and parent has pointer id

### 1 -> 3
- [x] interval check and parent doesn't have pointer id

### 2 -> 4
- [x] interval check
  - [x] parent next judge index change
- [x] time out
  - [x] parent next judge index change
- [x] next note come
  - [x] parent next judge index change
- [x] pointer up
  - [x] parent next judge index change
  - [x] parent pointer id set 0
  - [x] remove from holding slide list

### 3 -> 4
- [x] pointer down
  - [x] parent next judge index change
  - [x] parent pointer id set
  - [x] add to holding slide list
- [x] time out
  - [x] parent next judge index change
- [x] next note come
  - [x] parent next judge index change

---

## Slide End

1. can't be judged
2. can be judged as holding slide end
3. can be judged as single
4. judged

### 1 -> 2
- [x] interval check and parent has pointer id

### 1 -> 3
- [x] interval check and parent doesn't have pointer id

### 2 -> 4
- [x] pointer up
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0
  - [x] remove from holding slide list
- [x] time out
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0
  - [x] remove from holding slide list

### 3 -> 4
- [x] pointer down
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0
- [x] time out
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0

---

## Slide Flick End

1. can't be judged
2. can be judged as holding slide flick end
3. can be judged as flick
4. holding flick
5. judged

### 1 -> 2
- [x] interval check and parent has pointer id

### 1 -> 3
- [x] interval check and parent doesn't have pointer id

### 2 -> 4
- [x] interval check
  - [x] add to holding flick list

### 2 -> 5
- [x] interval check pointer not at lane
  - [x] remove from holding flick list
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0
- [x] pointer up
  - [x] remove from holding flick list
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0

### 3 -> 4
- [x] pointer down
  - [x] add to holding flick list

### 3 -> 5
- [x] time out
  - [x] remove from holding flick list

### 4 -> 5
- [x] pointer move
  - [x] remove from holding flick list
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0
- [x] time out
  - [x] remove from holding flick list
  - [x] parent next judge index set to undefined
  - [x] parent pointer id set to 0



