import React from "react";
import ReactDOM from "react-dom";
import { API_KEY, CLIENT_ID } from "./api";

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',
].join(' ');

async function getFiles() {
    const request: {
        fields: string,
        q: string,
        pageToken: undefined | string
    } = {
        'fields': '*',
        'q': "mimeType contains 'audio/'",
        'pageToken': undefined,
    };

    let files: gapi.client.drive.File[] = [];
    let hasNextPage = true;

    while (hasNextPage) {
        const response = await gapi.client.drive.files.list(request);
        console.log(response.result);
        if (response.result.files) {
            files = files.concat(response.result.files);
        }
        if (response.result.nextPageToken) {
            request.pageToken = response.result.nextPageToken;
            hasNextPage = true;
        } else {
            hasNextPage = false;
        }
    }
    return files;
}

class MusicPlayer extends React.Component<{}, { isSignedIn: boolean, files: { name: string, id: string, link: string }[], preText: string }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isSignedIn: false,
            files: [],
            preText: "",
        }
    }

    componentDidMount() {
        gapi.load('client:auth2', () => this.initClient());
    }

    async initClient() {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            });

            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => this.updateSigninStatus(signedIn));
            // Handle the initial sign-in state.
            this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        } catch (error) {
            this.appendPre(JSON.stringify(error, null, 2));
        }
    }

    updateSigninStatus(isSignedIn: boolean) {
        this.setState({ isSignedIn });
        getFiles().then((value) => {
            const files = value.map((file) => ({
                name: file.name ?? '',
                id: file.id ?? '',
                link: file.webContentLink ?? '',
            }));
            this.setState({ files })
        })
    }

    appendPre(message: string) {
        this.setState({ preText: this.state.preText + message + '\n' });
    }

    render() {
        return <div>
            <AuthButton isSignedIn={this.state.isSignedIn} />
            <MusicList files={this.state.files} />
            <pre>{this.state.preText}</pre>
        </div>
    }
}

const AuthButton: React.FunctionComponent<{ isSignedIn: boolean }> = (props) => {
    if (props.isSignedIn) {
        return <button onClick={() => gapi.auth2.getAuthInstance().signOut()}>Sign Out</button>;
    } else {
        return <button onClick={() => gapi.auth2.getAuthInstance().signIn()}>Authorize</button>;
    }
}

const MusicList: React.FunctionComponent<{ files: { name: string, id: string, link: string }[] }> = (props) => {
    if (props.files.length == 0) {
        return <div>No files</div>
    }
    const listitems = props.files.map(
        ({ name, id, link }) => <MusicListItem name={name} id={id} link={link} />);
    return <div>
        Files:
        <ul>{listitems}</ul>
    </div>;
}

const MusicListItem: React.FunctionComponent<{ name: string, id: string, link: string }> = (props) => {
    const playing: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        console.log(props.link);
        let audio = new Audio(props.link);
        audio.play();
    };
    return <li>
        {props.name}({props.id})
        <button onClick={playing}>play</button>
    </li>;
}

ReactDOM.render(<MusicPlayer />, document.getElementById('root'));