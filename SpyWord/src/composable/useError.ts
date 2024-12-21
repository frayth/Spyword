export function useError(code:number):string{
    switch (code) {
        case 4031:
            return "Nom déja existant et mot de passe incorrect"
        case 4032:
            return "Erreur sur la partie"
        case 4011:
        case 4012:
            return "Erreur d'identification"
        case 4013:
            return "Impossible de rejoindre, la partie n'existe pas"
        case 4014:
            return "Impossible de rejoindre, la partie est pleine"
        default:
            return "oups! une erreur est survenue"
    }
}