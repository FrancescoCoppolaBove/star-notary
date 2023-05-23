import Web3 from 'web3';
import starNotaryArtifact from '../../build/contracts/StarNotary.json';

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function () {
    const { web3 } = this;

    try {
      // get contract instance
      const netId = await web3.eth.net.getId();
      const deployedNetwork = starNotaryArtifact.networks[netId];
      this.meta = new web3.eth.Contract(
        starNotaryArtifact.abi,
        deployedNetwork.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
    } catch (error) {
      console.error('Error! Is not possible to connect to contract.');
    }
  },

  setStatus: function (message) {
    const status = document.getElementById('status');
    status.innerHTML = message;
  },

  createStar: async function () {
    const { createStar } = this.meta.methods;
    const name = document.getElementById('starName').value;
    const id = document.getElementById('starId').value;
    await createStar(name, id).send({ from: this.account });
    App.setStatus('New Star Owner is ' + this.account + '.');
  },

  lookUp: async function () {
    const { lookUptokenIdToStarInfo } = this.meta.methods;
    const id = document.getElementById('lookid').value;
    const starName = await lookUptokenIdToStarInfo(id).call({
      from: this.account,
    });
    App.setStatus('Star Id is ' + id + ', Star Name is ' + starName + '.');
  },
};

window.App = App;

window.addEventListener('load', async function () {
  if (window.ethereum) {
    App.web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live'
    );
    App.web3 = new Web3(
      new Web3.providers.HttpProvider('http://127.0.0.1:9545')
    );
  }

  App.start();
});
