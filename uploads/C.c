#include <time.h>
int main() {
  int t;
  scanf("%d",&t);
  clock_t start, end; 
  while(t--){
    start = clock(); 
    UserMain();
    end = clock()-start; 
    double x = ((double)end)/CLOCKS_PER_SEC;
    if(x > timeLimit){
      exit(0); //TLE
    }
  }
  return 0;
}