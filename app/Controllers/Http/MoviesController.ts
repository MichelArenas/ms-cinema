import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Movie from "App/Models/Movie";
import MovieValidator from 'App/Validators/MovieValidator';

export default class MoviesController {
    public async find({ request, params }: HttpContextContract) {
        console.log("listando")
        if (params.id) {
            let themovie: Movie = await Movie.findOrFail(params.id)
            return themovie; // Visualizar un solo elemento 
        } else {
            const data = request.all()
            if ("page" in data && "per_page" in data) {
                const page = request.input('page', 1); // Paginas 
                const perPage = request.input("per_page", 20); // Lista los primeros 20
                return await Movie.query().paginate(page, perPage)
            } else {
                return await Movie.query()
            } // Devuelve todos los elementos 

        }

    }
    public async create({ request }: HttpContextContract) {
        await request.validate(MovieValidator)
        const body = request.body();
        const themovie: Movie= await Movie.create(body);
        return themovie;
    }

    public async update({ params, request }: HttpContextContract) {
        const themovie: Movie = await Movie.findOrFail(params.id);
        const body = request.body();
        themovie.name = body.name;
        themovie.duration = body.duration;
        themovie.date= body.date;
        return await themovie.save();
    }

    public async delete({ params, response }: HttpContextContract) {
        const themovie: Movie = await Movie.findOrFail(params.id);
            response.status(204);
            return await themovie.delete();
    }
}
