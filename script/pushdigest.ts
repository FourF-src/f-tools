import octokit from '@octokit/rest';
import {readFileSync} from 'fs';
import yaml from 'yaml';
const secConfig = require('../secret.json');
const config = require('../src/config.json');
const { repo, owner } = config;

const sdk = new octokit({
    auth: secConfig.token
});
interface Item {
    title: string;
    tag: string;
    author: string;
    description: string;
    link: string;
    abstract: string;
}
async function create(today:string, data: Item[]) {
    const title = '/digest/' + today;
    const body = `today's digest`;
    const labels = ['digest'];
    const res = await sdk.issues.create({ repo, owner, title, body, labels });
    if (typeof res.data.number === 'undefined') {
        return;
    }
    const issue = res.data.number;
    await createComments(issue, data);
    return res.data;
}
async function createComments(issue:number, data:Item[]){
    const p = data.map(el => sdk.issues.createComment({
        repo, owner, body: yaml.stringify(el), issue_number: issue
    }));

    const comments = await Promise.all(p);

    const pp = comments.map(el => sdk.reactions.createForIssueComment({
        repo, owner, comment_id: el.data.id, content: "+1"
    }))
    await Promise.all(pp);
    
}
async function isExist(today:string){
    const title = '/digest/' + today;
    const res = await sdk.issues.listForRepo({owner, repo, labels:'digest', state:'open'});
    if (res.data && res.data instanceof Array){
        const i = res.data.find(el=>el.title===title);
        if (i){
            return i
        }
    }
}

async function main(){
    const txt = readFileSync('./today.yaml', {encoding:'utf8'});
    const d = yaml.parse(txt);
    let issue = await isExist(d.date)
    if (issue){
        await createComments(issue.id, d.data);
    } else{
        issue = await create(d.date, d.data);
    }
    return issue;
}

main().then(res=>console.log('done... ',res!.html_url )).catch(console.error);