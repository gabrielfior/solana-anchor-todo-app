import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TodoListApp } from "../target/types/todo_list_app";
import { assert } from "chai";

describe("todo-list-app", () => {
  // Configure the client to use the local cluster.
   
   anchor.setProvider(anchor.AnchorProvider.env());
   const program = anchor.workspace.TodoListApp as Program<TodoListApp>;
   const author = program.provider as anchor.AnchorProvider;

  xit("can create a task", async () => {
    const task = anchor.web3.Keypair.generate();
    const tx = await program.methods.addingTask("great task").accounts({
      task: task.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([task]).rpc();
    console.log("Your transaction signature", tx);

    const taskAccount = await program.account.task.fetch(task.publicKey);
    console.log('your task', taskAccount);
    assert.equal(
      taskAccount.author.toBase58(),
      author.wallet.publicKey.toBase58()
      );
      assert.equal(taskAccount.text, "great task");
      assert.equal(taskAccount.isDone, false);
      assert.ok(taskAccount.createdAt);
      assert.ok(taskAccount.updatedAt);
  });

  it.only('can create and update a task', async () => {
    // ToDo - Fix this
        const task = anchor.web3.Keypair.generate();
        const user = anchor.web3.Keypair.generate();
    // create a new task
    const tx = await program.methods.addingTask("great task").accounts({
      task: task.publicKey,
      author: user.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([task]).rpc();
    console.log("Your transaction signature", tx);

    const taskAccount = await program.account.task.fetch(task.publicKey);
    // fetch it from the same address
    // then update
    
    const txUpdate = await program.methods
      .updatingTask(true)
      .accounts({
        task: task.publicKey,
        author: user.publicKey,
      })
      .signers([user, task])
      .rpc();

    console.log("Your transaction signature", txUpdate);

    // assert.equal(
    //   taskAccount.author.toBase58(),
    //   author.wallet.publicKey.toBase58()
    //);
    //assert.equal(taskAccount.isDone, true);
  });
  xit('can create and delete a task', async () => {
    const task = anchor.web3.Keypair.generate();
    const user = anchor.web3.Keypair.generate();
    const tx = await program.methods.addingTask("great task").accounts({
      task: task.publicKey,
      author: user.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).signers([user]).rpc();
    console.log("Your transaction signature", tx);

    // delete
     const txDelete = await program.methods.deletingTask().accounts({
       task: task.publicKey,
       author: user.publicKey
     }).signers([user]).rpc();
    

    const taskAccount = await program.account.task.fetch(task.publicKey);
    console.log('task account', taskAccount);

    
  });
});
