# for surface+mineral, ignore blanks and ones that say "Parcel Number", take out spaces and - and concatenate
# column 3 or [2]
from tasks.to_be_moved.land_grab.university_real_estate.entities import Parcel


def txam_mineral_parser(l) -> Parcel:
    parcel_number = l[2]
    p = Parcel(original_number=parcel_number, county=l[1])

    if len(parcel_number.split('-')) != 3:
        return None

    if '-' in parcel_number:
        parcel_number = ''.join(parcel_number.split('-'))
        p.normalized_number = parcel_number

    return p