declare module "morgan" {
  import { RequestHandler } from "express";
  function morgan(format: string): RequestHandler;
  export default morgan;
}
