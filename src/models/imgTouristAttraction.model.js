var readIMGTouristByTourID = "SELECT * FROM image where tourid = $1";
var addIMGTourist       = "INSERT INTO image(imageName, imagePath, tourID) values ($1, $2, $3)";
var checkIMGTouristByID = "SELECT * FROM image where imageID = $1"
var deleteImageById    = "DELETE FROM image WHERE imageID = $1";

module.exports = {
    readIMGTouristByTourID,
    addIMGTourist,
    checkIMGTouristByID,
    deleteImageById,
}