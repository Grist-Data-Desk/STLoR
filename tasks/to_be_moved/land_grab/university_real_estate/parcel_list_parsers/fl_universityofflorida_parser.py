from tasks.to_be_moved.land_grab.university_real_estate.entities import Parcel


def fluf_parser(l) -> Parcel:
    # take out - and concatenate
    # column 2 or [1]
    # ignore header cell

    parcel_number = l[1]
    p = Parcel(original_number=parcel_number, county=l[5])

    if '-' in parcel_number:
        parcel_number = ''.join(parcel_number.split('-'))
        p.normalized_number = parcel_number
        return p

    return p
