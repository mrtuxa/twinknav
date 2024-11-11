import fetch from 'node-fetch'; // If you're using Node.js, ensure you have node-fetch installed.


interface Station {
    id: string;
    relevance: number;
    score: number;
    weight: number;
    type: string;
    ril100: string;
    name: string;
    location: {
        type: string;
        latitude: number;
        longitude: number;
    };
    operator: {
        type: string;
        id: string;
        name: string;
    };
    address: {
        city: string;
        zipcode: string;
        street: string;
    };
}

class ApiCall {
    getTransportRest(company: string) {
        return `https://${company}.transport.rest`
    }
}

export class UrlBuilder {
    company: string;
    url: string;
    constructor(company: string) {
        this.company = company;
    }

    static build(company: string) {
        const api = new ApiCall();
        return api.getTransportRest(company);
    }
}

export class HeaderBuilder {
    headers = {
        'Accept': 'application/x-json',
    };
    private static headers: { Accept: string };



   static default() {
       return this.headers;
   }
}

export class StationBuilder {
    private url: string = UrlBuilder.build("v6.db");
    private query: string | null = null;
    private limit: number | null = null;
    private fuzzy: boolean = false;
    private completion: boolean = true;
    private acceptHeader: String = 'application/json'

    public setQuery(query: string): StationBuilder {
        this.query = query;
        return this;
    }

    public setLimit(limit: number): StationBuilder {
        this.limit = limit;
        return this;
    }

    public setFuzzy(fuzzy: boolean): StationBuilder {
        this.fuzzy = fuzzy;
        return this;
    }

    public setCompletion(completion: boolean): StationBuilder {
        this.completion = completion;
        return this;
    }

    public async build(): Promise<any> {
        const params: URLSearchParams = new URLSearchParams();

        if (this.query) {
            params.append('query', this.query);
        }
        if (this.limit !== null) {
            params.append('limit', this.limit.toString());
        }
        if (this.fuzzy) {
            params.append('fuzzy', 'true');
        }
        if (this.completion) {
            params.append('completion', 'true');
        }

        const response = await fetch(`${this.url}/stations?${params.toString()}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseText = await response.text();

        // If the response is NDJSON, we split it into lines and parse each line
        if (this.acceptHeader === 'application/x-ndjson') {
            return responseText
                .split('\n')
                .filter(line => line)
                .map(line => JSON.parse(line));
        }

        // Otherwise, parse it as JSON
        return responseText;
    }
}
