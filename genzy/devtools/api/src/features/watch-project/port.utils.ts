import net from "net";

const isPortOpen = async (port: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    let s = net.createServer();
    s.once("error", (err: any) => {
      s.close();
      resolve(false);
    });
    s.once("listening", () => {
      resolve(true);
      s.close();
    });
    s.listen(port);
  });
};

const getNextOpenPort = async (startFrom: number) => {
  let openPort: number | null = null;
  while (startFrom < 65535 || !!openPort) {
    if (await isPortOpen(startFrom)) {
      openPort = startFrom;
      break;
    }
    startFrom++;
  }
  return openPort as number;
};

export { getNextOpenPort };
