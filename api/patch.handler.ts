import { Application } from 'express';
import { applyPatch, JsonPatchError, validate } from 'fast-json-patch';
import { PatchResult } from 'fast-json-patch/lib/core';
import { connection, Types, Mongoose } from 'mongoose';

export class PatchHandler {
  protected app: Application;
  protected routeName: string;
  protected resource: string;

  /**
   *
   * @remarks
   * The constructor receives an express application, the route name where
   * the verb will be exposed and the name of the resource, the entity name.
   * Usually, routeName and resource will be the same
   *
   * @param app
   * @param routeName
   * @param resource
   */
  constructor(app: Application, routeName: string, resource: string) {
    this.app = app;
    this.routeName = routeName;
    this.resource = resource;
  }

  public registerPatch(): void {
    this.app.patch(`${this.routeName}/:id`, async (req, res) => {
      try {
        if (!this.isValidDocumentId(req.params.id)) {
          return res
            .status(404)
            .send(res.__('id provided is not valid'));
        }
        const jsonPatchOperations: any = req.body;
        const documentId: Types.ObjectId = Types.ObjectId(req.params.id);

        const documentToPatch = await this.getDocument(documentId);

        if (!this.documentExists(documentToPatch)) {
          return res
            .status(404)
            .send(res.__('Document requested could not be found'));
        }


        this.validatePatch(res, jsonPatchOperations, documentToPatch);

        const patchedDocument = this.getPatchedDocument(documentToPatch, jsonPatchOperations);

        const updatedDocument = await this.updateDocument(documentId, patchedDocument);

        return res.status(200).send(updatedDocument);
      } catch (e) {
        console.error(e);
        return res.status(400).send(res.__(e.message));
      }
    });
  }

  public isValidDocumentId(documentId: any) {
    return Types.ObjectId.isValid(documentId);
  }

  public async getDocument(documentId: any) {
    return connection.models[this.resource].findOne({
      _id: new Types.ObjectId(documentId)
    });
  }

  public documentExists(documentToPatch: any) {
    return documentToPatch !== null;
  }

  private validatePatch(res: any, jsonPatches: any, documentToPatch: any) {
    const patchErrors = validate(jsonPatches, documentToPatch);
    if (!this.isValidPatch(patchErrors)) {
      throw patchErrors;
    }
  }

  public isValidPatch(patchErrors: JsonPatchError) {
    return patchErrors === undefined;
  }

  public getPatchedDocument(documentToPatch: any, jsonPatchOperations: any): PatchResult<any> {
    const validateOperation: boolean = true;
    const patchedDocument = applyPatch(documentToPatch, jsonPatchOperations, validateOperation);
    return patchedDocument;
  }

  public async updateDocument(documentId: Types.ObjectId, patchedDocument: any) {
    return connection.models[this.resource].updateOne(
      { _id: new Types.ObjectId(documentId) },
      { $set: patchedDocument.newDocument },
      { new: true }
    );
  }
}
