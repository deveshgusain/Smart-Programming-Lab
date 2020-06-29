#include<bits/stdc++.h>
using namespace std;

typedef long long ll;

void solve()
{
	ll n;
	cin>>n;
	vector<ll> arr(n);
	for(int i=0;i<n;i++)
		cin>>arr[i];
	sort(arr.begin(),arr.end());
	for(int i=0;i<n;i++)
		cout<<arr[i]<<" ";
}

int main()
{
	int t;
	cin>>t;
	while(t--)
	{
		solve();
		cout<<"\n";
	}
	return 0;
}
