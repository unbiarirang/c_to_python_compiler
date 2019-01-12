#include <stdio.h>
#include <string.h>

int test(char* s, int len) {
    int i = 0;
	int j = len;
    j--;
    while (i < j) {
        if (s[i] != s[j]) {
			return 0;
        }
        i++;
        j--;
    }
    return 1;
}

int main() {
    char s[200];
    printf("Enter the string to test: ");
    scanf("%s", s);
    if (test(s, strlen(s))) {
		printf("True");
    }
    else {
		printf("False");
    }
    return 0;
}
