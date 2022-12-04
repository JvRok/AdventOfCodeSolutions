import os
score = 0

rps = {
  "A": 1,
  "B": 2,
  "C": 3,
  "X": 1,
  "Y": 2,
  "Z": 3
}
#Idea here is to use modulus to wrap around, and add 3 to keep base same but positive.
#With this calculation, the draw is always 0, win is always 1.
with open(os.path.join(os.getcwd(), 'input'), 'r') as input:
  for line in input:
    if line != '\n':
      score += (rps[line[2]] - 1) * 3 #Score for d/w/l
      score += list(rps.values())[(rps[line[0]] + rps[line[2]] + 3) % 3]
print(score)