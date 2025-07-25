const tts = require('@google-cloud/text-to-speech');
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');

dotenv.config();

const credentials = {
    type: process.env.type,
    project_id: process.env.project_id,
    private_key_id: process.env.private_key_id,
    private_key: process.env.private_key,
    client_email: process.env.client_email,
    client_id: process.env.client_id,
    auth_uri: process.env.auth_uri,
    token_uri: process.env.token_uri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
};

const ttsclient = new tts.v1.TextToSpeechLongAudioSynthesizeClient({
    credentials
});
const storageclient = new Storage({
    credentials
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function hypnosisRecording(filename, script, name, languageCode, orderpaid, freesamplesent) {
    let type;
    if (orderpaid) {
        type = 'orderpaid';
    } else if (!freesamplesent) {
        type = 'freesamplesent';
    } else { return { success: false } }
    const outputGcsUri = `gs://${process.env.gcs_bucket_name}/${filename}`;
    const parent = process.env.parent;
    const request = {
        parent,
        input: { ssml: script },
        voice: {
            languageCode,
            ssmlGender: 'MALE',
            name,
        },
        audioConfig: { audioEncoding: 'LINEAR16' },
        outputGcsUri,
    };
    console.log('synth long audio request', request);
    const file = storageclient.bucket(process.env.gcs_bucket_name).file(filename);
    const [fileExists] = await file.exists();
    if (fileExists) {
        await storageclient.bucket(process.env.gcs_bucket_name).file(filename).delete();
    }
    const output = await ttsclient.synthesizeLongAudio(request);
    const [operation] = output;
    console.log(output);
    const operationname = operation.name;

    console.log('Generating recording...');
    while (true) {
        let [currentoperation] = await ttsclient.operationsClient.getOperation({ name: operationname });
        const progress = await ttsclient.checkSynthesizeLongAudioProgress(operationname);
        if(progress?.metadata?.progressPercentage){
            console.log('Progress: ', progress.metadata.progressPercentage);
        }
        if (currentoperation.done) {
            console.log('Done creating recording.');
            await storageclient.bucket(process.env.gcs_bucket_name).file(filename).makePublic();
            return {
                success: true,
                type,
                downloadurl: `https://storage.googleapis.com/${process.env.gcs_bucket_name}/${filename}`
            };
        }
        await delay(1000); // Limit loop so we don't get stuck
    }
}

module.exports = {
    hypnosisRecording
}