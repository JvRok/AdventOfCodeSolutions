import os
priorityTotal = 0
#Constant that is how far off 0 the char is
#used to calc priority
ordlcoffset = 96
orducoffset = 38


def calcAndReturn(char):
  if char.isupper():
    return ord(char) - orducoffset
  else:
    return ord(char) - ordlcoffset

#Idea here it to use a dict to see if an item has been assigned, and store it if it hasnt
#It will always be even numbered. So split down the middle, and flip flop between them as 
#you want to "circuit break" as soon as you find the answer, so setting the entire half first is a waste of computation
with open(os.path.join(os.getcwd(), 'input'), 'r') as input:
  for line in input:
    index = len(line)//2
    count = 0
    dictArray = [{}, {}]
    arrayIndex = 0
    while(index > 0):
      if count % 2 == 0: 
        index += count
        arrayIndex = 0
      else:
        index-= count
        arrayIndex = 1
      count+=1
      if(line[index] in dictArray[arrayIndex]):
        priorityTotal +=calcAndReturn(line[index])
        break
      else: 
        dictArray[(arrayIndex + 1) % 2][line[index]] = True

print(priorityTotal)