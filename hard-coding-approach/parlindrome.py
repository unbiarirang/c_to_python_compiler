def test(s, len):
    i = 0
    j = len
    j = j - 1
    while (i<j):
        if (s[i]!=s[j]):
            return 0
        i = i + 1
        j = j - 1

    return 1
s = ''
print("Enter the string to test: ")
s = input()
if (test(s,len(s))):
    print("True")
else:
    print("False")

