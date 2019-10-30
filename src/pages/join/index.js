import React from 'react'
import Layout from '../../components/Layout'
import PageTitle from '../../components/PageTitle'
import {Link, StaticQuery} from "gatsby";
import SecondaryTitle from "../../components/SecondaryTitle";

const Index = () => (
  <StaticQuery query={graphql`
    query MembershipPrices {
      firstClaim: allStripeSku(filter: {product: {name: {eq: "Manchester YMCA Harriers Club Membership"}}, attributes: {name: {glob: "First*"}}, active: {eq: true}}) {
        edges {
          node {
            price
            attributes {
              name
            }
          }
        }
      }
    }
  `} render={({firstClaim}) => {
    const firstClaimDescription = firstClaim.edges[0].node.attributes.name
    const firstClaimPrice = "£" + (firstClaim.edges[0].node.price / 100).toFixed(2)

    return (
      <Layout>
        <section className="section">
          <div className="container">
            <div className="content">
              <PageTitle title={'Join us'}
                         subtitle={firstClaimDescription + " is just " + firstClaimPrice + "!"} />
                         <p/>
              <SecondaryTitle title={"How to join"} />
              <p>If you are interested in joining us, we encourage you to come
                down to one of our Thursday evening club runs and "try before
                you buy".</p>
              <p>If you're coming down for the first time and you need somewhere
                to get changed, give the Y Club membership team a call on <a
                  href="tel:+441618373535">0161 837 3535</a> and they will make
                arrangements for you to use the changing facilities free of
                charge. Otherwise, there's no need to let anyone know that
                you're coming - just turn up at the Y Club reception in your
                running kit at 6:30pm.</p>
              <p>Once you decide we are the club for you, join the club using
                our online membership application form:</p>

              <p className="has-text-centered">
                <Link to={"/join/apply"} className="button is-primary">Join us
                  now!</Link>
              </p>

              <p>Of course, if you've got any questions before you come down,
                don't hesitate to <Link to="/contact">get in touch</Link>!</p>

              {/* New Runners Night, Thursday 5th October */}

              <SecondaryTitle title={"Membership Benefits"} />
              <p>Joining a running club - <em>any running club</em> - is a great
                way of getting fit and making friends. The Manchester YMCA
                Harriers are no exception.</p>

              <h3 className={"title is-size-6"}>England Athletics
                Registration</h3>
              <p>All membership packages include registration with England
                Athletics. Some of the key benefits of being an England
                Athletics registered athlete are:</p>
              <ul>
                <li>A £2 discount on entry to most races</li>
                <li>Discounts at various sports shops and England Athletics
                  partners
                </li>
              </ul>

              <p>For full details of the benefits of being a registered athlete,
                please visit <a href="https://www.englandathletics.org">England
                  Athletics</a>.</p>

              <h3 className={"title is-size-6"}>Manchester Athletics Scheme</h3>
              <p>Manchester YMCA Harriers members have the opportunity to join
                the Manchester Athletics Scheme, which provides discounted entry
                to our track training sessions held at the <Link
                  to={"/venues/manchester-regional-arena"}>Manchester Regional
                  Arena</Link>.</p>

              <h3 className={"title is-size-6"}>Complimentary club clobber</h3>
              <p>We love to see our members representing the Club in races, both
                close to home and far away. We give every new member their first
                Manchester YMCA Harriers club vest or T-shirt for free!</p>

              {/* The Manchester YMCA Harriers Club Vest, as modelled by Sarah Crandon */}

              <h3 className={"title is-size-6"}>Race as part of a team</h3>
              <p>Running can be a very individual pursuit, but it doesn't have
                to be - there are many brilliant team running events which we
                take part in.</p>

              {/* Manchester YMCA Harriers at Equinox24 */}

              <h3 className={"title is-size-6"}>Regular jaunts, both at home and
                abroad</h3>
              <p>Many of our members use running as a way of seeing the wider
                world. Groups of us will regularly travel to places near and far
                to take part in running events.</p>

              {/* Manchester YMCA Harriers at the 2018 Copenhagen Marathon */}

              <p>Our members do everything from an overnighter in the Lake
                District to a long weekend for a big city marathon.</p>

              <h3 className={"title is-size-6"}>Location, location,
                location!</h3>
              <p>We are based at <Link to={"/venues/the-y-club"}>the Y
                Club</Link> on Liverpool Road in Castlefield - right in the
                heart of Manchester city centre. We're a five-minute walk away
                from Deansgate-Castlefield tram stop.</p>

              <h3 className={"title is-size-6"}>It's not all about the
                running</h3>
              <p>We hold club socials on the first Thursday of every month, when
                we exploit the many eating and drinking opportunities that
                Manchester has to offer.</p>
              <p>A hill-repeat session is just that little bit easier when you
                know there's some delicious food and a cold glass of beer
                waiting for you when you get back!</p>

              <p className="has-text-centered">
                <Link to={"/join/apply"} className="button is-primary">Join us
                  now!</Link>
              </p>

              {/* First Thursday Social at Beat Street MCR */}

              <SecondaryTitle
                title={"A note on the use of Y Club facilities"} />
              <p>We meet at <Link to={"/venues/the-y-club"}>the Y
                Club</Link> for our Thursday group runs and Sunday morning
                marathon training runs.</p>
              <p className="has-text-weight-bold">You must be a member of the Y
                Club to use the Y Club's facilities, including the changing
                rooms, lockers, showers and toilets.</p>
              <p>Y Club membership can be arranged with the Y Club
                reception.</p>

              <h3 className={"title is-size-6"}>Y Club Social Membership</h3>
              <p>The Y Club offers a special <strong>Social
                Membership</strong> option for Manchester YMCA Harriers members.
                Y Club Social Membership allows you to use the changing rooms,
                lockers, showers and toilets before and after our Thursday
                evening group runs and Sunday morning marathon training
                sessions.</p>
              <p>Y Club Social Membership is priced at £5 per month, payable by
                Direct Debit.</p>

              <h3 className={"title is-size-6"}>Y Club Gym Membership</h3>
              <p>The Y Club offers various gym membership packages that allow
                you to use all of the Y Club's facilities.</p>
              <p>More information on Y Club gym membership options is available
                at the <a href="https://www.yclub.org.uk/">Y Club website</a>.
              </p>
            </div>
          </div>
        </section>
      </Layout>
    )
  }} />
)

export default Index
