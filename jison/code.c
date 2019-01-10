#include <stdio.h>
#include <string.h>

int test(char* s, int len) {
    int i = 0;
	int j = len;
    i--;
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
    i = printf + 3 *8 /5;
    printf("Enter the string to test: ");
    scanf("%s", s);
    if (test(s, strlen(s))) {
		printf("true");
    }
    else {
		printf("false");
    }
    return 0;
}
