#include<iostream>
#include<string>
#include<iomanip>
#include<vector>
#include <fstream>

using namespace std;

struct item{
    string name;
    double price;
    int qty;
};

void exportToExcel(const string& month, const vector<item>& composition, double grandTotal) {
    ofstream outFile(month + "_Bill.csv");
    if (!outFile.is_open()) {
        cout << "Error creating Excel file!" << endl;
        return;
    }

    outFile << "Item Name,Total Quantity,Rate,Subtotal" << endl;
    for (const auto& it : composition) {
        if (it.qty > 0) {
            outFile << it.name << "," << it.qty << "," << it.price << "," << (it.qty * it.price) << endl;
        }
    }
    outFile << ",,,Total Revenue:," << grandTotal << endl;
    outFile.close();
    cout << "\nSuccess! Bill exported to " << month << "_Bill.csv" << endl;
}

void editQuantities(vector<item>& composition) {
    int choice;
    while(true) {
        cout << "\n" << string(50, '=') << endl;
        cout << "Edit Quantities Menu" << endl;
        cout << string(50, '=') << endl;

        for(int i = 0; i < composition.size(); i++) {
            cout << i+1 << ". " << left << setw(20) << composition[i].name 
                 << "Current Qty: " << composition[i].qty << endl;
        }

        cout << (composition.size() + 1) << ". Done Editing" << endl;
        cout << "Enter item number to edit (or " << (composition.size() + 1) << " to finish): ";
        cin >> choice;

        if(choice == composition.size() + 1) break;
        if(choice < 1 || choice > composition.size()) {
            cout << "Invalid choice!" << endl;
            continue;
        }

        int newQty;
        cout << "Enter new quantity for " << composition[choice-1].name << ": ";
        cin >> newQty;
        composition[choice-1].qty = newQty;
        cout << "Updated successfully!" << endl;
    }
}

int main(){
    //defining contents in vector dynamic array (template, quantities reset per month)
    vector<item> composition = {
        {"Manager coat", 75.0 , 0 },{"Manager pant", 10.0 , 0 },{"Manager shirt", 10.0 , 0 },
        {"Blackpant", 10.0 , 0 },{"Chef coat", 10.0 , 0 },{"Chef apron", 4.0 , 0 },
        {"Wrapping sheet", 4.0 , 0 },{"Ut shirt", 6.0 , 0 },{"Jeans pant", 10.0 , 0 },
        {"t-shirt", 6.0 , 0 },{"Blue shirt", 10.0 , 0 },{"Chef pant", 10.0 , 0 }
    };

    char anotherMonth = 'Y';
    while(anotherMonth == 'Y' || anotherMonth == 'y') {
        // reset quantities for new month
        for(auto &it : composition) it.qty = 0;

        string month;
        int days;
        cout<<"Enter month of billing:  "<<endl;
        cin>>month;
        cout<<"Enter days in billing month: "<<endl;
        cin>>days;

        //nested loop to dispay month with days
        for(int d= 1;d<=days;d++){
            cout<<"\n-----------------"<<d<<" "<<month<<" record -----------------"<<endl;

            for(int i=0; i<composition.size();i++){
                int dailyQty;
                cout<<"qty for "<<left<<setw(17)<<composition[i].name<<":";
                cin>>dailyQty;

                composition[i].qty+=dailyQty;

            }
            char choice; 
            cout << "Day " << d << " of " << days << " finished. Continue? (Y/N): ";
            cin >> choice;
            if(choice== 'n'||choice== 'N') break;

        }

        double Grand_total=0;
        cout<<"\n\n"<<string(50,'=')<<endl;
        cout<<"Final bill for "<<month<<endl;
        cout<<string(50,'=')<<endl;
        cout<<left<<setw(20)<<"Item"<<setw(15)<<"Qty"<<"Sub_total"<<endl;
        cout<<string(50,'-')<<endl;

        //const auto&item:composition to read from vector
        for(const auto&item:composition){
            if(item.qty>0){
                double sub=item.qty*item.price;
                Grand_total+=sub;
                cout<<left<<setw(20)<<item.name<<setw(10)<<item.qty<<"Rs"<<sub<<endl;
            }
        }
        cout<<string(50,'-')<<endl;
        cout<<"Grand total revenue: rs."<<Grand_total<<endl;
        cout<<string(50,'=')<<endl;
        
        // Edit quantities before export
        char editChoice;
        cout << "\nDo you want to edit any quantities? (Y/N): ";
        cin >> editChoice;
        if(editChoice == 'Y' || editChoice == 'y') {
            editQuantities(composition);
            
            // Recalculate grand total
            Grand_total = 0;
            cout << "\n\n" << string(50,'=') << endl;
            cout << "Updated bill for " << month << endl;
            cout << string(50,'=') << endl;
            cout << left << setw(20) << "Item" << setw(15) << "Qty" << "Sub_total" << endl;
            cout << string(50,'-') << endl;
            
            for(const auto&item:composition){
                if(item.qty>0){
                    double sub=item.qty*item.price;
                    Grand_total+=sub;
                    cout<<left<<setw(20)<<item.name<<setw(10)<<item.qty<<"Rs"<<sub<<endl;
                }
            }
            cout<<string(50,'-')<<endl;
            cout<<"Grand total revenue: rs."<<Grand_total<<endl;
            cout<<string(50,'=')<<endl;
        }
        exportToExcel(month, composition, Grand_total);

        cout << "\nProcess another month? (Y/N): ";
        cin >> anotherMonth;
    }

    return 0;

}


