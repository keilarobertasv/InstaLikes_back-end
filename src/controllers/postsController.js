import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";
import {getTodosOsPosts, createPost, atualizarPost} from "../models/postModels.js";
import { url } from "inspector";

export async function listarPosts(req, res) {

    const posts = await getTodosOsPosts();
    res.status(200).json(posts);
   
} 


export async function criarNovoPost(req, res) {
    const novoPost = req.body;
    try{
        const postCriado = await createPost(novoPost);
        res.status(200).json(postCriado);
    }
    catch(erro){
        console.error(erro.message);    
        res.status(500).json({"Erro:":"Falha na requisição"})

    }
    
};

export async function uploadImagem(req, res) {
    
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    }
    try{
        const postCriado = await createPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada);
        res.status(200).json(postCriado);
    }
    catch(erro){
        console.error(erro.message);    
        res.status(500).json({"Erro:":"Falha na requisição"})

    }
    
};

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`;

    try{
        
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);

        const postAtualizado = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }

        const postCriado = await atualizarPost(id, postAtualizado);
        res.status(200).json(postCriado);
    }
    catch(erro){
        console.error(erro.message);    
        res.status(500).json({"Erro:":"Falha na requisição"})

    }
    
};
