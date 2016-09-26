/**
 * Created by eqo on 6/28/16.
 */

class RemoteData {
    public localData:           any;
    public fetchedData:         any;
    public fetchedSingleData:   any;

    public lastResponse:   any;

    public postUrl:     String;
    public getUrl:      String;
    public deleteUrl:   String;
    public updateUrl:   String;

    private _httpService;

    constructor(postUrl: String, getUrl: String, deleteUrl: String, updateUrl: String, localDataForm: any, httpService){
        this.deleteUrl      = deleteUrl;
        this.getUrl         = getUrl;
        this.updateUrl      = updateUrl;
        this.postUrl        = postUrl;
        this.localData      = localDataForm;
        this._httpService   = httpService;
        this.fetchedData    = [];
    }

    static formatData(data){
        let myString = "";
        for(var dataBit in data){
            if(myString.length){
                myString += "&";
            }
            myString += dataBit.toString() + "=" + JSON.stringify(data[dataBit]);
        }
        return myString;
    }

    httpPromise(settings){
        return new Promise((res, rej) => {
            this._httpService(settings).then(res, rej);
        })
    }

    getAllData() {
        return this.httpPromise({
            method: 'GET',
            url: this.getUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: ''
        }).then(response => {
            this.lastResponse = response;
            this.fetchedData = response.data;
            return this.fetchedData;
        });
    }

    getSingleData(id){
        return this.httpPromise({
            method: 'GET',
            url: this.getUrl + "/" + id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: ""
        }).then(response => {
            this.lastResponse = response;
            this.fetchedSingleData = response.data;
            return this.fetchedSingleData;
        })
    }

    postToRemote(){
        return this.httpPromise({
            method: 'POST',
            url: this.postUrl,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: RemoteData.formatData(this.localData)
        }).then(response => {
            this.lastResponse = response;
            return this.getAllData();
        })
    }

    updateRemote(id){
        return this.httpPromise({
            method: 'PUT',
            url: this.updateUrl + "/" + id.toString(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: RemoteData.formatData(this.localData)
        }).then(response => {
            this.lastResponse = response;
            return this.getAllData();
        })
    }

    deleteRemote(id){
        return this.httpPromise({
            method: 'DELETE',
            url: this.deleteUrl  + "/" + id.toString(),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: ""
        }).then(response => {
            this.lastResponse = response;
            return this.getAllData();
        })

    }

    clearLocal(){
        for(var field in this.localData){
            this.localData[field] = "";
        }
    }
}