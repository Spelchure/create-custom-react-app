const tasks = require("./tasks");
const fs = require("fs");
const { stub, spy } = require("sinon");
const { expect } = require("chai");
const path = require("path");
const chai = require("chai");
const child_process = require("child_process");

chai.use(require("chai-as-promised"));
const dirPrefix = "dirPrefix";

describe("Tests for all tasks works correctly", () => {
  before(function () {
    tasks.initialize(dirPrefix);
  });

  it("Task.copyFiles should copy files to specified directory", async () => {
    const dummyFileList = {
      simpleFile: "src/simpleFile",
      another: "src/main/anotherFile",
    };
    const copyFileSrc = path.join(__dirname, "templates", "simpleFile");
    const copyFileDest = path.join(
      process.cwd(),
      dirPrefix,
      dummyFileList["simpleFile"]
    );

    const secondCopyFileSrc = path.join(__dirname, "templates", "another");
    const secondCopyFileDest = path.join(
      process.cwd(),
      dirPrefix,
      dummyFileList["another"]
    );
    const fsCopyFileStub = stub(fs.promises, "copyFile").resolves();

    await tasks.copyFiles(dummyFileList);

    expect(fsCopyFileStub.calledTwice).to.be.ok;

    expect(fsCopyFileStub.calledWith(copyFileSrc, copyFileDest)).to.be.ok;
    expect(fsCopyFileStub.calledWith(secondCopyFileSrc, secondCopyFileDest)).to
      .be.ok;

    fsCopyFileStub.restore();
  });

  it("Task.createDirectories should create directories in project folder", async () => {
    let directoryList = ["someDirectory1", "someDirectory2", "someDirectory3"];
    let origJoin = path.join;

    let fsMkdirStub = stub(fs.promises, "mkdir").resolves();
    let pathJoinStub = stub(path, "join").callsFake((...args) => {
      let result = origJoin(...args);
      return result;
    });
    await tasks.createDirectories(directoryList);
    expect(pathJoinStub.calledThrice).to.be.ok;
    expect(fsMkdirStub.calledThrice).to.be.ok;
    directoryList.forEach((directory) => {
      expect(
        fsMkdirStub.calledWith(origJoin(process.cwd(), dirPrefix, directory))
      ).to.be.ok;
    });
    pathJoinStub.restore();
    fsMkdirStub.restore();
  });

  it("Task.deleteFiles should delete files.", async () => {
    const fileList = ["file1", "file2"];

    const origJoin = path.join;
    const joinSpy = spy(path, "join");
    let statStub = stub(fs.promises, "stat").resolves();
    const unlinkStub = stub(fs.promises, "unlink");

    await tasks.deleteFiles(fileList);

    // Resolves
    fileList.forEach((file) => {
      const fpath = origJoin(process.cwd(), dirPrefix, file);
      expect(joinSpy.calledWith(process.cwd(), dirPrefix, file)).to.be.ok;
      expect(statStub.calledWith(fpath)).to.be.ok;
      expect(unlinkStub.calledWith(fpath)).to.be.ok;
    });

    //With reject
    statStub.restore();
    statStub = stub(fs.promises, "stat").rejects();

    await expect(tasks.deleteFiles(["testfile"])).to.be.rejectedWith("Error");

    statStub.restore();
    unlinkStub.restore();
    joinSpy.restore();
  });
});
