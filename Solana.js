// We pretend to use it to create users wallet, check balance, and transfer SOL from user to Simpity.

// Import necessary modules
require('dotenv').config();
const solanaWeb3 = require('@solana/web3.js');

// Connect to the Solana Mainnet
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// Restore wallet from private key stored in environment variable
const getWalletFromEnv = () => {
  const secretKey = Uint8Array.from(JSON.parse(process.env.SENDER_PRIVATE_KEY));
  return solanaWeb3.Keypair.fromSecretKey(secretKey);
};

// Check balance of a wallet
const getBalance = async (publicKey) => {
  try {
    const balance = await connection.getBalance(publicKey);
    console.log(`Wallet balance: ${balance / solanaWeb3.LAMPORTS_PER_SOL} SOL`);
    return balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
  }
};

// Transfer SOL between wallets
const transferSol = async (sender, receiverPublicKey, amountSol) => {
  try {
    const transaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: receiverPublicKey,
        lamports: amountSol * solanaWeb3.LAMPORTS_PER_SOL,
      })
    );

    const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [sender]);
    console.log("Transaction signature:", signature);
  } catch (error) {
    console.error("Error transferring SOL:", error);
  }
};