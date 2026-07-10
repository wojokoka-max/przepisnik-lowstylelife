import { Router, type IRouter } from "express";
import healthRouter from "./health";
import fetchUrlRouter from "./fetch-url";
import recipeFromImageRouter from "./recipe-from-image";
import recipeFromNameRouter from "./recipe-from-name";
import recipeFromIngredientsRouter from "./recipe-from-ingredients";
import transcribeAudioRouter from "./transcribe-audio";

const router: IRouter = Router();

router.use(healthRouter);
router.use(fetchUrlRouter);
router.use("/recipe-from-image", recipeFromImageRouter);
router.use("/recipe-from-name", recipeFromNameRouter);
router.use("/recipe-from-ingredients", recipeFromIngredientsRouter);
router.use("/transcribe-audio", transcribeAudioRouter);

export default router;
